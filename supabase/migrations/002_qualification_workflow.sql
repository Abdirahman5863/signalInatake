ALTER TABLE intake_forms ADD COLUMN IF NOT EXISTS instructions TEXT;
ALTER TABLE intake_forms ADD COLUMN IF NOT EXISTS questions JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE intake_forms ADD COLUMN IF NOT EXISTS qualification_policy JSONB NOT NULL DEFAULT '{"minBudget":null,"goldThreshold":75,"silverThreshold":50,"manualReviewConfidence":45}'::jsonb;
ALTER TABLE intake_forms ADD COLUMN IF NOT EXISTS booking_url TEXT;
ALTER TABLE intake_forms ADD COLUMN IF NOT EXISTS result_messages JSONB NOT NULL DEFAULT '{"gold":"You look like a strong fit. Choose a time that works for you.","silver":"Thanks — your answers are being reviewed and we will follow up shortly.","bronze":"Thanks for sharing the details. We will keep you in mind as the fit develops.","manualReview":"Thanks — we need a quick human review before recommending the next step."}'::jsonb;

ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS confidence_score INTEGER;
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS confidence_level TEXT;
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS strengths JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS risks JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS dm_script TEXT;
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS rule_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS hard_rule_triggered TEXT;
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS ai_analysis JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS qualification_status TEXT NOT NULL DEFAULT 'received';
ALTER TABLE lead_responses ADD COLUMN IF NOT EXISTS pipeline_status TEXT NOT NULL DEFAULT 'new';

CREATE INDEX IF NOT EXISTS idx_lead_responses_qualification_status ON lead_responses(qualification_status);
CREATE INDEX IF NOT EXISTS idx_lead_responses_pipeline_status ON lead_responses(pipeline_status);

DROP POLICY IF EXISTS "Users can update leads from their forms" ON lead_responses;
CREATE POLICY "Users can update leads from their forms"
  ON lead_responses FOR UPDATE
  USING (EXISTS (SELECT 1 FROM intake_forms WHERE intake_forms.id = lead_responses.form_id AND intake_forms.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM intake_forms WHERE intake_forms.id = lead_responses.form_id AND intake_forms.user_id = auth.uid()));
