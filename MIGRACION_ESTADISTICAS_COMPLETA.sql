-- MIGRACIÓN COMPLETA, IDEMPOTENTE: ejecutar antes de publicar esta versión.
-- Conserva todos los pedidos y eventos existentes.
create extension if not exists pgcrypto;
create table if not exists public.web_orders (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 items jsonb not null default '[]'::jsonb, delivery text not null default '', address text not null default '',
 note text not null default '', shipping_fee numeric(12,2) not null default 0,
 total numeric(12,2) not null default 0, status text not null default 'pending',
 preference_id text, payment_id text
);
create table if not exists public.web_events (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 event_type text not null, items jsonb not null default '[]'::jsonb
);
alter table public.web_orders add column if not exists customer_name text;
alter table public.web_orders add column if not exists attribution jsonb;
alter table public.web_orders add column if not exists payment_method text;
alter table public.web_orders add column if not exists idempotency_key uuid;
alter table public.web_events add column if not exists attribution jsonb;
alter table public.web_events add column if not exists total numeric(12,2);
create unique index if not exists web_orders_idempotency_key_uidx on public.web_orders(idempotency_key);
create index if not exists web_orders_created_at_idx on public.web_orders(created_at desc);
create index if not exists web_events_created_at_idx on public.web_events(created_at desc);
create index if not exists web_orders_attribution_campaign_idx on public.web_orders ((attribution->>'last_campaign'));
create index if not exists web_events_attribution_campaign_idx on public.web_events ((attribution->>'last_campaign'));
update public.web_orders set payment_method='mercadopago' where payment_method is null and status <> 'whatsapp_intent';
alter table public.web_orders enable row level security;
alter table public.web_events enable row level security;
-- Backend únicamente: no agregar políticas públicas.
-- Comprobación automática: la consulta falla si alguna columna requerida no existe.
do $$ begin
 if exists (select 1 from (values
 ('web_orders','id'),('web_orders','created_at'),('web_orders','items'),('web_orders','delivery'),
 ('web_orders','address'),('web_orders','note'),('web_orders','shipping_fee'),('web_orders','total'),
 ('web_orders','status'),('web_orders','preference_id'),('web_orders','payment_id'),
 ('web_orders','customer_name'),('web_orders','attribution'),('web_orders','payment_method'),('web_orders','idempotency_key'),
 ('web_events','id'),('web_events','created_at'),('web_events','event_type'),('web_events','items'),
 ('web_events','attribution'),('web_events','total')) as required(tbl,col)
 where not exists(select 1 from information_schema.columns c where c.table_schema='public' and c.table_name=required.tbl and c.column_name=required.col))
 then raise exception 'Faltan columnas requeridas en web_orders o web_events'; end if;
end $$;
select 'OK: esquema de estadísticas completo' as resultado;
