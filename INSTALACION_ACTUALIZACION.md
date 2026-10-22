# Brookies — actualización integral

1. Antes de reemplazar código, exportá una copia de `products` y `site_settings` desde Supabase.
2. Ejecutá SOLO `MIGRACION_SEGURA.sql` en Supabase > SQL Editor. **No vuelvas a ejecutar `supabase.sql`**: ese archivo es de instalación inicial. La migración agrega columnas y no borra productos.
3. Subí el CONTENIDO de esta carpeta al repositorio GitHub existente, conservando las rutas (sin crear una carpeta anidada). Vercel debería desplegar automáticamente.
4. En `/admin`, completá las fotos y opciones de cada box: tipo «Personalizable», número de unidades y productos que pueden seleccionarse como sabores. Los productos existentes se conservan como «Individual» hasta que los configures.
5. Creá la categoría `Royal` desde Administrar categorías y asigná a ella los paquetes Royal existentes o nuevos.
6. Marcá «Mostrar también en Para regalar» en boxes, tarjetas y detalles. Marcá «Incluir en el carrusel de portada» en los productos elegidos.
7. Subí las fotos de Celebraciones y Business desde Contenido; pulsá «GUARDAR CONTENIDO» para publicar.
8. Probá una box con sabores, galería, carrito, recomendación Royal, envío y WhatsApp en Vercel antes de cambiar el dominio.

Notas: la vista «Todos» muestra inicialmente solo boxes, según la última decisión comercial; «Ver todas las Brookies» despliega los demás productos. El campo `catalog_initial_count` se conserva como preferencia futura, pero no limita las boxes en esta modalidad. El acceso `/admin` permanece activo aunque se quite su enlace del pie. Las fotos se alojan en el bucket público `brookies-media` usando el endpoint autenticado. La migración debe ejecutarse antes del despliegue.

Validación: se revisó la estructura del ZIP y el código modificado; no se pudo completar `npm install` en este entorno (agotó el tiempo), por lo que la compilación final deberá verificarse en los Build Logs de Vercel. Si falla, no modifiques ni borres tablas: enviá el primer error de compilación.
