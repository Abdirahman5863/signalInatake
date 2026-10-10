-- Apply in staging first. No public reads or scored writes to the underlying tables.
BEGIN;
ALTER TABLE public.intake_forms ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
ALTER TABLE public.intake_forms ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE public.lead_responses ADD COLUMN IF NOT EXISTS submission_key uuid;
ALTER TABLE public.lead_responses ADD COLUMN IF NOT EXISTS request_hash text;
ALTER TABLE public.lead_responses ADD COLUMN IF NOT EXISTS form_snapshot jsonb;
ALTER TABLE public.lead_responses ADD COLUMN IF NOT EXISTS decision_snapshot jsonb;
ALTER TABLE public.lead_responses ADD COLUMN IF NOT EXISTS public_result jsonb;
ALTER TABLE public.lead_responses ADD COLUMN IF NOT EXISTS rule_version text;
ALTER TABLE public.lead_responses ADD COLUMN IF NOT EXISTS analysis_status text NOT NULL DEFAULT 'legacy';
CREATE UNIQUE INDEX IF NOT EXISTS lead_submission_once ON public.lead_responses(form_id, submission_key);
CREATE INDEX IF NOT EXISTS leads_form_date_id ON public.lead_responses(form_id, created_at DESC, id DESC);

REVOKE ALL ON public.intake_forms, public.lead_responses FROM anon;
DROP POLICY IF EXISTS "Anyone can create lead responses (public form submission)" ON public.lead_responses;
REVOKE INSERT, UPDATE, DELETE ON public.lead_responses FROM authenticated;
GRANT SELECT ON public.lead_responses TO authenticated;
GRANT UPDATE (pipeline_status) ON public.lead_responses TO authenticated;
GRANT ALL ON public.intake_forms, public.lead_responses TO service_role;

CREATE OR REPLACE FUNCTION public.bump_intake_version() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  NEW.version := OLD.version + 1;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS intake_version ON public.intake_forms;
CREATE TRIGGER intake_version BEFORE UPDATE ON public.intake_forms FOR EACH ROW EXECUTE FUNCTION public.bump_intake_version();

CREATE TABLE IF NOT EXISTS public.lead_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL UNIQUE REFERENCES public.lead_responses(id) ON DELETE CASCADE,
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','running','completed','failed')),
  attempts integer NOT NULL DEFAULT 0,
  available_at timestamptz NOT NULL DEFAULT now(),
  lease_until timestamptz,
  lease_token uuid,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS jobs_due ON public.lead_jobs(state, available_at);
ALTER TABLE public.lead_jobs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.lead_jobs FROM anon, authenticated;
GRANT ALL ON public.lead_jobs TO service_role;

CREATE TABLE IF NOT EXISTS public.intake_usage (
  bucket text NOT NULL,
  period timestamptz NOT NULL,
  count integer NOT NULL,
  PRIMARY KEY(bucket, period)
);
ALTER TABLE public.intake_usage ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.intake_usage FROM anon, authenticated;
GRANT ALL ON public.intake_usage TO service_role;

CREATE TABLE IF NOT EXISTS public.lead_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.lead_responses(id) ON DELETE CASCADE,
  actor_id uuid,
  event text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_lead_date ON public.lead_events(lead_id, created_at);
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.lead_events FROM anon, authenticated;
GRANT SELECT ON public.lead_events TO authenticated;
GRANT ALL ON public.lead_events TO service_role;
CREATE POLICY "Owner reads lead events" ON public.lead_events FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.lead_responses l JOIN public.intake_forms f ON f.id=l.form_id WHERE l.id=lead_id AND f.user_id=auth.uid())
);

CREATE OR REPLACE FUNCTION public.record_pipeline_change() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.pipeline_status IS NULL OR NEW.pipeline_status NOT IN ('new','contacted','booked','held','won','lost','archived') THEN
    RAISE EXCEPTION 'INVALID_PIPELINE_STATUS';
  END IF;
  IF OLD.pipeline_status IS DISTINCT FROM NEW.pipeline_status THEN
    INSERT INTO public.lead_events(lead_id, actor_id, event) VALUES(NEW.id, auth.uid(), NEW.pipeline_status);
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS pipeline_event ON public.lead_responses;
CREATE TRIGGER pipeline_event AFTER UPDATE OF pipeline_status ON public.lead_responses FOR EACH ROW EXECUTE FUNCTION public.record_pipeline_change();

-- Only the server can invoke capture. Lead, receipt, snapshot and job commit together.
CREATE OR REPLACE FUNCTION public.capture_enquiry(
  p_form_id uuid, p_version integer, p_key uuid, p_hash text,
  p_name text, p_email text, p_answers jsonb, p_decision jsonb, p_result jsonb,
  p_rule_version text, p_enqueue boolean
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  f public.intake_forms%ROWTYPE;
  prior public.lead_responses%ROWTYPE;
  lead_id uuid;
  used integer;
BEGIN
  SELECT * INTO f FROM public.intake_forms WHERE id=p_form_id FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'FORM_UNAVAILABLE'; END IF;
  -- Serializes duplicates and quotas across all forms belonging to one owner.
  PERFORM pg_advisory_xact_lock(hashtextextended(f.user_id::text,0));
  SELECT * INTO prior FROM public.lead_responses WHERE form_id=f.id AND submission_key=p_key;
  IF FOUND THEN
    IF prior.request_hash IS DISTINCT FROM p_hash THEN RAISE EXCEPTION 'IDEMPOTENCY_CONFLICT'; END IF;
    RETURN jsonb_build_object('leadId',prior.id,'result',prior.public_result,'duplicate',true);
  END IF;
  IF NOT f.is_published THEN RAISE EXCEPTION 'FORM_UNAVAILABLE'; END IF;
  IF f.version <> p_version THEN RAISE EXCEPTION 'FORM_CHANGED'; END IF;
  IF p_key IS NULL OR length(p_hash) <> 64 OR length(p_name)>120 OR length(p_email)>254 OR pg_column_size(p_answers)>65536 THEN RAISE EXCEPTION 'INVALID_SUBMISSION'; END IF;
  INSERT INTO public.intake_usage(bucket,period,count) VALUES('form:'||f.id,date_trunc('hour',now()),1)
    ON CONFLICT(bucket,period) DO UPDATE SET count=intake_usage.count+1 RETURNING count INTO used;
  IF used>100 THEN RAISE EXCEPTION 'INTAKE_LIMIT'; END IF;
  INSERT INTO public.intake_usage(bucket,period,count) VALUES('owner:'||f.user_id,date_trunc('day',now()),1)
    ON CONFLICT(bucket,period) DO UPDATE SET count=intake_usage.count+1 RETURNING count INTO used;
  IF used>1000 THEN RAISE EXCEPTION 'INTAKE_LIMIT'; END IF;
  INSERT INTO public.lead_responses(form_id,lead_name,lead_email,answers,badge,summary,strengths,risks,dm_script,action,rule_breakdown,hard_rule_triggered,confidence_score,confidence_level,qualification_status,pipeline_status,submission_key,request_hash,form_snapshot,decision_snapshot,public_result,rule_version,analysis_status)
    VALUES(f.id,p_name,p_email,p_answers,p_decision->>'badge',p_decision->>'summary',p_decision->'strengths',p_decision->'risks',p_decision->>'dmScript',p_decision->>'action',p_decision->'ruleBreakdown',p_decision->>'hardRuleTriggered',(p_decision->>'confidenceScore')::integer,p_decision->>'confidenceLevel',p_decision->>'qualificationStatus','new',p_key,p_hash,
      jsonb_build_object('version',f.version,'questions',f.questions,'policy',f.qualification_policy,'form_name',f.form_name),p_decision,p_result,p_rule_version,CASE WHEN p_enqueue THEN 'pending' ELSE 'rules_only' END)
    RETURNING id INTO lead_id;
  INSERT INTO public.lead_events(lead_id,event) VALUES(lead_id,'received');
  IF p_enqueue THEN INSERT INTO public.lead_jobs(lead_id) VALUES(lead_id); END IF;
  RETURN jsonb_build_object('leadId',lead_id,'result',p_result,'duplicate',false);
END $$;

CREATE OR REPLACE FUNCTION public.claim_lead_jobs() RETURNS SETOF public.lead_jobs
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE slots integer;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('leadvett-worker-slots',0));
  WITH exhausted AS (
    UPDATE public.lead_jobs SET state='failed',last_error='RETRY_LIMIT' WHERE state='running' AND lease_until<now() AND attempts>=3 RETURNING lead_id
  ) UPDATE public.lead_responses SET analysis_status='failed' WHERE id IN (SELECT lead_id FROM exhausted);
  SELECT greatest(0,2-count(*)::integer) INTO slots FROM public.lead_jobs WHERE state='running' AND lease_until>now();
  RETURN QUERY WITH due AS (
    SELECT id FROM public.lead_jobs WHERE attempts<3 AND ((state='pending' AND available_at<=now()) OR (state='running' AND lease_until<now()))
    ORDER BY available_at FOR UPDATE SKIP LOCKED LIMIT slots
  ) UPDATE public.lead_jobs j SET state='running',attempts=j.attempts+1,lease_until=now()+interval '2 minutes',lease_token=gen_random_uuid()
    FROM due WHERE j.id=due.id RETURNING j.*;
  DELETE FROM public.intake_usage WHERE period<now()-interval '7 days';
END $$;

CREATE OR REPLACE FUNCTION public.finish_lead_job(p_id uuid,p_token uuid,p_draft text,p_error text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE j public.lead_jobs%ROWTYPE;
BEGIN
  SELECT * INTO j FROM public.lead_jobs WHERE id=p_id AND lease_token=p_token AND state='running' AND lease_until>now() FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  IF p_error IS NULL THEN
    IF p_draft IS NULL OR length(p_draft)=0 OR length(p_draft)>2000 THEN RAISE EXCEPTION 'INVALID_DRAFT'; END IF;
    UPDATE public.lead_responses SET dm_script=p_draft,analysis_status='completed' WHERE id=j.lead_id;
    UPDATE public.lead_jobs SET state='completed',lease_until=NULL,lease_token=NULL,last_error=NULL WHERE id=j.id;
  ELSE
    UPDATE public.lead_jobs SET state=CASE WHEN attempts>=3 THEN 'failed' ELSE 'pending' END,
      available_at=now()+make_interval(secs => (30*power(2,attempts))::integer),lease_until=NULL,lease_token=NULL,last_error=left(p_error,80) WHERE id=j.id;
    UPDATE public.lead_responses SET analysis_status=CASE WHEN j.attempts>=3 THEN 'failed' ELSE 'pending' END WHERE id=j.lead_id;
  END IF;
  RETURN true;
END $$;

REVOKE ALL ON FUNCTION public.capture_enquiry(uuid,integer,uuid,text,text,text,jsonb,jsonb,jsonb,text,boolean) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.claim_lead_jobs() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.finish_lead_job(uuid,uuid,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.capture_enquiry(uuid,integer,uuid,text,text,text,jsonb,jsonb,jsonb,text,boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_lead_jobs() TO service_role;
GRANT EXECUTE ON FUNCTION public.finish_lead_job(uuid,uuid,text,text) TO service_role;
COMMIT;
