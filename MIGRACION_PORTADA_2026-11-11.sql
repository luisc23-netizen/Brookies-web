-- Separar el texto anterior en dos campos editables, sin borrar otros ajustes.
INSERT INTO public.site_settings (key,value) VALUES
('hero_secondary_description','Tómese su tiempo, experimente y si puede, comparta.')
ON CONFLICT (key) DO NOTHING;

-- Solo separar el texto principal si conserva el contenido original completo.
UPDATE public.site_settings
SET value = 'Usted está a punto de disfrutar verdaderas piezas de autor.'
WHERE key = 'hero_description'
  AND value LIKE 'Usted está a punto de disfrutar verdaderas piezas de autor.%'
  AND value LIKE '%Tómese su tiempo, experimente y si puede, comparta.%';

-- Mostrar seis cajas inicialmente.
INSERT INTO public.site_settings (key,value) VALUES ('catalog_initial_count','6')
ON CONFLICT (key) DO UPDATE SET value='6';
