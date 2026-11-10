-- Ejecutar una vez en Supabase SQL Editor. Compatible con pedidos anteriores.
ALTER TABLE public.web_orders ADD COLUMN IF NOT EXISTS customer_name text;
