BEGIN;
ALTER TABLE public.products
 ADD COLUMN IF NOT EXISTS is_tiny boolean NOT NULL DEFAULT false,
 ADD COLUMN IF NOT EXISTS tiny_quantity integer,
 ADD COLUMN IF NOT EXISTS available_as_tiny_flavor boolean NOT NULL DEFAULT false;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_tiny_quantity_check;
ALTER TABLE public.products ADD CONSTRAINT products_tiny_quantity_check
 CHECK ((NOT is_tiny AND tiny_quantity IS NULL) OR (is_tiny AND tiny_quantity BETWEEN 1 AND 1000));
CREATE TABLE IF NOT EXISTS public.web_interactions (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 created_at timestamptz NOT NULL DEFAULT now(),
 action text NOT NULL,
 detail text NOT NULL DEFAULT '',
 session_id uuid NOT NULL
);
CREATE INDEX IF NOT EXISTS web_interactions_created_at_idx ON public.web_interactions(created_at DESC);
ALTER TABLE public.web_interactions ENABLE ROW LEVEL SECURITY;
-- Sin políticas públicas: únicamente backend con clave de servicio.
COMMIT;
