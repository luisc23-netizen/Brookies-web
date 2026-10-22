# Brookies — panel ampliado

Esta actualización conserva la base de datos existente. No vuelvas a ejecutar `supabase.sql` ni el importador del catálogo.

## Publicar
1. Descomprimí este ZIP. En GitHub, repositorio Brookies-web, rama main, elegí Add file > Upload files.
2. Subí el CONTENIDO de la carpeta `Brookies-web-main`, manteniendo la estructura `app/` y `lib/`. Asegurate de reemplazar los archivos existentes, no crear una carpeta anidada.
3. Confirmá el commit y comprobá en Vercel > Deployments que el nuevo despliegue esté Ready / Current.
4. Abrí `/admin` y probá primero cambiar `Título del catálogo` a un texto temporal y volver a `ELEGÍ TUS BROOKIES`.

## Novedades
- Nuevos campos de textos de navegación, portada, cinta, catálogo, regalos, visita, eventos, empresas, pie y carrito.
- Administrador de categorías: crear, ordenar, mostrar/ocultar, renombrar (actualiza las categorías de los productos) y eliminar solo categorías sin productos.
- El catálogo actual, precios, fotos y credenciales de Vercel/Supabase no se reemplazan.

## Precauciones
- Hacé una copia de seguridad/exportación de las tablas `products` y `site_settings` antes de actualizar.
- Si Vercel muestra un error de compilación, no toques Supabase; compartí los Build Logs.
- Las fotos siguen configurándose por URL HTTPS pública; esta entrega no agrega carga directa de archivos.
- Las categorías se guardan en `site_settings` y no requieren ejecutar SQL adicional.

## Logotipo como imagen (actualización)
En /admin > Identidad de marca podés subir un logo PNG, JPG, WebP o GIF de hasta 3 MB. Se recomienda PNG o WebP con transparencia. El sistema crea automáticamente un bucket público `brookies-media` en el Supabase existente (usando la clave de servicio ya configurada en Vercel) y guarda la URL en `site_settings.logo_image`. No ejecutes de nuevo supabase.sql. El logo se muestra en la cabecera y el pie; sin logo se conserva el texto original. También podés pegar una URL HTTPS. La subida y el guardado son automáticos; al quitarlo, presioná Guardar cambios.
