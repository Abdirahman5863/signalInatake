-- Repair intake form fields omitted by an earlier partial migration.
-- Additive and safe to re-run; refresh PostgREST after the transaction commits.
BEGIN;

ALTER TABLE public.intake_forms
  ADD COLUMN IF NOT EXISTS qualification_policy jsonb NOT NULL
    DEFAULT '{"minBudget":null,"goldThreshold":75,"silverThreshold":50,"manualReviewConfidence":45}'::jsonb,
  ADD COLUMN IF NOT EXISTS result_messages jsonb NOT NULL
    DEFAULT '{"gold":"You look like a strong fit. Choose a time that works for you.","silver":"Thanks — your answers are being reviewed and we will follow up shortly.","bronze":"Thanks for sharing the details. We will keep you in mind as the fit develops.","manualReview":"Thanks — we need a quick human review before recommending the next step."}'::jsonb,
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

NOTIFY pgrst, 'reload schema';

COMMIT;
