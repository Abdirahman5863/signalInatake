-- Repair projects where the qualification migration was not applied, and refresh
-- PostgREST after adding the field used by the form editor and enquiry endpoint.
BEGIN;

ALTER TABLE public.intake_forms
  ADD COLUMN IF NOT EXISTS booking_url text;

NOTIFY pgrst, 'reload schema';

COMMIT;
