-- Run in Supabase SQL Editor. Never expose the service_role key in browser code.
create extension if not exists pgcrypto;
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 slug text not null unique,
 description text not null,
 ingredients text not null default '',
 price integer not null check (price >= 0),
 image text not null default '',
 category text not null default 'Cookies',
 featured boolean not null default false,
 active boolean not null default true,
 sort_order integer not null default 10,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
-- No public table policies: only server-side service_role can read/write.
insert into public.products (name,slug,description,ingredients,price,category,featured,sort_order) values
('Go Big 4','go-big-4','Cuatro cookies de autor. Elegí tus sabores al finalizar el pedido.','Consultar sabores disponibles',35000,'Cajas',true,1),
('Dark Side Nutella','dark-side-nutella','Una cookie para quienes creen que el chocolate nunca es demasiado.','Confirmar ingredientes y alérgenos con el local',9500,'Cookies',true,2),
('Cheesecake & Roses','cheesecake-roses','Centro cremoso de cheesecake y frutilla.','Confirmar ingredientes y alérgenos con el local',9500,'Cookies',true,3),
('Coco Sunset','coco-sunset','Masa aromática de coco tostado con corazón de mango.','Confirmar ingredientes y alérgenos con el local',9500,'Cookies',false,4)
on conflict (slug) do nothing;


-- Contenidos públicos editables únicamente por servidor autenticado.
create table if not exists public.site_settings (key text primary key,value text not null default '');
alter table public.site_settings enable row level security;
insert into public.site_settings (key,value) values
('whatsapp','5493412477553'),('rosario_delivery_fee','4000'),('hero_eyebrow','MADE IN ROSARIO · MADE TO BE REMEMBERED'),('hero_title','NOT YOUR ORDINARY COOKIE.'),('hero_description','Cookies de autor. Elegí tu Go Big y armá tu caja favorita.'),('hero_image',''),('gift_eyebrow','TAKE ROSARIO WITH YOU'),('gift_title','Un regalo que no se olvida.'),('gift_description','Una caja Brookies convierte cualquier ocasión en un gran plan.'),('gift_image',''),('event_eyebrow','LET’S CELEBRATE'),('event_title','Tu festejo merece algo extraordinario.'),('event_description','Cumpleaños, reuniones, mesas dulces y momentos para compartir.'),('business_title','Buenas relaciones. Mejores regalos.'),('business_description','Regalos empresariales para equipos, clientes y acciones de marca.') on conflict (key) do nothing;
