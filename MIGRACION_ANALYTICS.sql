-- Ejecutar UNA vez en Supabase SQL Editor ANTES de publicar la nueva web.
-- No borra datos ni modifica el checkout anterior.
alter table public.web_orders add column if not exists attribution jsonb;
alter table public.web_events add column if not exists attribution jsonb;
alter table public.web_events add column if not exists total numeric(12,2);
create index if not exists web_orders_attribution_campaign_idx on public.web_orders ((attribution->>'last_campaign'));
create index if not exists web_events_attribution_campaign_idx on public.web_events ((attribution->>'last_campaign'));
-- Conservar RLS habilitado; solo service_role accede a las estadísticas.
