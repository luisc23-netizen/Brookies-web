# ENTREGA ACTUALIZADA — 22 OCT 2026

- **Sin imágenes incorporadas:** los campos de imágenes comienzan vacíos y se completan desde `/admin` con URLs HTTPS de las fotos que elijas.
- **WhatsApp predeterminado:** `5493412477553` (`https://wa.me/5493412477553`). También está precargado en `.env.example` y en instalaciones nuevas de `supabase.sql`. Si ya ejecutaste un SQL anterior, cambiá el teléfono en el panel `/admin` (el `on conflict do nothing` no reemplaza configuraciones existentes).
- **Mensaje del carrito:** saludo, nombre, teléfono, modalidad, dirección si aplica, sabores/aclaraciones, renglón por producto con cantidad y subtotal, costo de envío, total estimado y código de referencia `BRK-...` generado en el navegador. No se registra un pedido automáticamente: solo llega a Brookies cuando el cliente pulsa Enviar en WhatsApp. El código es una referencia práctica, no un identificador de pedido persistido en base de datos.
- Retiro gratis, Rosario $4.000 por pedido, otras zonas a cotizar. La compra y el pago se confirman por chat. Sin Mercado Pago.
- **Limitación actual:** la elección de sabores se escribe en el campo de aclaraciones; todavía no hay selector visual por unidad/caja. Revisar y cargar precios definitivos antes de publicar.

**Este ZIP no incluye fotografías, renders, íconos de imagen ni imágenes de muestra.** Los espacios para fotos aparecen como FOTO PENDIENTE hasta que cargues tus propias imágenes desde /admin. Las fotos no se guardan en el repositorio: se suben a un almacenamiento público (por ejemplo Supabase Storage) y se pega su URL HTTPS en el panel.

# BROOKIES.AR — versión para GitHub y publicación de prueba

**Esta versión reemplaza los ZIP anteriores.** Diseño móvil crema/borravino, Go Big primero, cierre exclusivamente por WhatsApp. No hay Mercado Pago ni pagos automáticos. Los pedidos no se almacenan: el cliente envía el detalle desde su WhatsApp; Brookies confirma disponibilidad y forma de pago por chat.

## Publicación
1. Descomprimí el ZIP. En GitHub, repositorio `Brookies-web`, elegí **uploading an existing file** y subí el contenido de la carpeta `brookies-web` (no el ZIP). Los archivos ocultos `.env.example` y `.gitignore` pueden necesitar seleccionarse manualmente. No subas `.env.local` ni claves privadas.
2. En Supabase, creá proyecto y ejecutá `supabase.sql` en SQL Editor. Si ya tenés tablas anteriores, el script usa `if not exists` para productos y contenidos. La tabla `orders` anterior puede permanecer sin usarse.
3. En Vercel, importá el repositorio GitHub, Framework Next.js y configurá variables de entorno según `.env.example`. Para editar y persistir el catálogo son necesarias `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` y `SESSION_SECRET`.
4. Publicá primero en URL temporal Vercel. Configurá `NEXT_PUBLIC_SITE_URL` con la URL temporal; después actualizala a `https://brookies.ar` y redeploy.
5. Entrá a `/admin`, iniciá sesión con `ADMIN_PASSWORD`. Editá los textos y fotos, y cargá el número de WhatsApp en formato internacional sin `+`, por ejemplo `549341...`. Las fotos se cargan a un bucket público en Supabase Storage y se pega la URL HTTPS. El panel actual usa **una sola contraseña**, no usuario individual ni recuperación de clave.
6. Configurá precios y sabores reales antes de compartir la web. Go Big 6 está inactiva como muestra hasta cargar precio vigente. El detalle de sabores se solicita en el campo de aclaraciones; todavía no hay selector visual de unidades por sabor.
7. Agregá `brookies.ar` y `www.brookies.ar` en Vercel > Domains y copiá los valores DNS **que Vercel indique** a la zona DNS de Donweb. No cambies nameservers si solo necesitás modificar A/CNAME. Comprobá HTTPS y el funcionamiento del carrito desde el teléfono.

## Edición
- `/admin` → Productos: nombre, descripción, precio, imagen por URL, categoría, orden, visible, destacado.
- `/admin` → Contenido, imágenes y contacto: portada, banners de regalos, celebraciones, empresas, costo fijo Rosario (inicialmente ARS 4000) y WhatsApp.
- Otras zonas: a consultar; el WhatsApp muestra total sujeto a cotización.
- El botón final siempre envía el pedido por WhatsApp; no existe cobro automático.

## Notas importantes
- El contenido demo es ilustrativo y no debe usarse para vender sin revisar. No se inventó el precio Go Big 6.
- Esta entrega no equivale a un sitio publicado; probar compilación, accesibilidad, móvil, seguridad y WhatsApp antes de anunciarla.
- SEO: metadata, sitemap, robots y Product/Offer Schema.org ya tienen base; completá fotografías, horarios, ubicación y datos reales. El dominio por sí solo no garantiza recomendaciones de IA.
