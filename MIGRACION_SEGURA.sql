-- Ejecutar UNA VEZ en Supabase SQL Editor. No borra productos ni configuraciones.
alter table public.products add column if not exists images jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists product_type text not null default 'individual';
alter table public.products add column if not exists box_size integer not null default 0;
alter table public.products add column if not exists option_ids jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists gift_eligible boolean not null default false;
alter table public.products add column if not exists hero_featured boolean not null default false;
update public.products set images=jsonb_build_array(image) where image<>'' and jsonb_array_length(images)=0;
insert into public.site_settings(key,value) values ('footer_address','Salta 1525, Rosario, Santa Fe'),('catalog_initial_count','6') on conflict(key) do nothing;
