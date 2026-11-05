-- Ejecutar una sola vez en Supabase SQL Editor. No elimina tablas existentes.
create extension if not exists pgcrypto;
create table if not exists public.web_orders (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 items jsonb not null, delivery text not null, address text not null default '',note text not null default '',
 shipping_fee numeric(12,2) not null default 0,total numeric(12,2) not null,
 status text not null default 'pending',preference_id text,payment_id text
);
create index if not exists web_orders_created_at_idx on public.web_orders(created_at desc);
create table if not exists public.web_events (
 id uuid primary key default gen_random_uuid(),created_at timestamptz not null default now(),
 event_type text not null,items jsonb not null default '[]'::jsonb
);
create index if not exists web_events_created_at_idx on public.web_events(created_at desc);
alter table public.web_orders enable row level security;
alter table public.web_events enable row level security;
-- Sin políticas públicas: solo el backend con service role puede leer/escribir.
