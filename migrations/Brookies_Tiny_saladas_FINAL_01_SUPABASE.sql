BEGIN;
ALTER TABLE public.products
 ADD COLUMN IF NOT EXISTS tiny_savory boolean NOT NULL DEFAULT false,
 ADD COLUMN IF NOT EXISTS available_as_savory_tiny_flavor boolean NOT NULL DEFAULT false;
COMMIT;
