-- Ejecutar una sola vez en Supabase > SQL Editor antes de subir esta versión.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS highlight_label text NOT NULL DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS highlight_style text NOT NULL DEFAULT 'none';
