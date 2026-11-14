# Catálogos Brookies: Meta y Google

## 1. Publicar en Vercel
Subir este proyecto y esperar a que el despliegue termine correctamente. Las variables SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar configuradas en Vercel (no exponer la clave de servicio al navegador). NEXT_PUBLIC_SITE_URL debe apuntar a https://brookies.ar.

## 2. Verificar los feeds
- Meta: https://brookies.ar/api/meta-feed (CSV)
- Google Merchant Center: https://brookies.ar/api/google-feed (RSS XML)

Abrir ambos enlaces en el navegador. Deben contener productos reales. Si devuelven error 503, revisar las variables de Supabase y los registros de Vercel. Los productos sin foto válida, sin precio positivo o sin slug se omiten. Las imágenes deben ser accesibles públicamente. No se publican productos de demostración si falta Supabase.

## 3. Meta Commerce Manager
En «Subir un archivo de datos», seleccionar «Administrador de ventas» y «Usar una URL». Pegar https://brookies.ar/api/meta-feed. Configurar actualización diaria y moneda ARS. No hace falta tener Instagram conectado para crear el catálogo.

## 4. Google Merchant Center
Crear o abrir la cuenta en https://merchants.google.com/; verificar y reclamar brookies.ar. En «Productos» > «Fuentes de datos», agregar una fuente mediante URL de archivo e introducir https://brookies.ar/api/google-feed. Configurar país Argentina, idioma español y moneda ARS. Completar envío, devoluciones, datos de contacto y políticas requeridas en Merchant Center. El feed no configura por sí solo el costo de envío de Google.

## Importante
El feed ofrece enlaces públicos a páginas de producto, con metadatos que redirigen visitantes humanos a la tienda vertical. Google y Meta pueden exigir requisitos adicionales para aprobar productos (por ejemplo políticas de entrega/devolución, fotos, disponibilidad y experiencia de compra). Verificar diagnóstico de ambos catálogos después de la primera importación. La disponibilidad se informa «en stock» para los productos activos; si la base de datos no tiene un campo de inventario confiable, ajustar esto antes de usarlo para campañas con stock variable.
