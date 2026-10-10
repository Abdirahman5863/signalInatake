-- Add readable public URLs while retaining share_link UUIDs for internal use.
BEGIN;

ALTER TABLE public.intake_forms
  ADD COLUMN IF NOT EXISTS slug text;

UPDATE public.intake_forms
SET slug = COALESCE(
  NULLIF(trim(both '-' from left(regexp_replace(lower(form_name), '[^a-z0-9]+', '-', 'g'), 48)), ''),
  'form'
) || '-' || left(replace(id::text, '-', ''), 10)
WHERE slug IS NULL OR btrim(slug) = '';

CREATE UNIQUE INDEX IF NOT EXISTS intake_forms_slug_unique
  ON public.intake_forms (slug)
  WHERE slug IS NOT NULL;

NOTIFY pgrst, 'reload schema';
COMMIT;
