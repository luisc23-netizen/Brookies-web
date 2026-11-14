# Brookies — rediseño vertical 14/11/2026

## Incluido
- Feed vertical por sabores de la categoría `Colección de Cookies` (también acepta `Cookies`), sin mostrar Go Big en el feed.
- Barra de espacios que se llenan, mejor precio por cantidad usando los productos Go Big 2, 4 y 6 existentes en Supabase, con programación dinámica para cualquier cantidad.
- Unidades de sabores agrupadas en cajas para checkout y producción; Mercado Pago y WhatsApp calculan el precio a partir del catálogo del servidor.
- Royal y Pequeños Detalles como etapa opcional antes del pago, sin pasos obligatorios.
- Celebraciones y Empresas con URL directa; `/cookies`, `/royal`, `/celebraciones`, `/empresas`, `/pequenos-detalles`.
- Páginas SEO `/productos/[slug]` (incluidas Go Big), sitemap dinámico, robots, datos estructurados Bakery y Product, llms.txt.
- Vista previa Open Graph con imagen editable en Admin → Contenido → Imagen para compartir en redes.
- Eliminado descuento nocturno en el checkout.

## Sin migración SQL nueva
Reutiliza `products`, `site_settings` (key/value) y `web_orders.items` (JSONB). El proyecto requiere que estén aplicadas las migraciones anteriores de pagos, nombre del cliente, WhatsApp y estadísticas.

## Comprobaciones necesarias antes de publicar
1. En Admin, verificar nombres exactos de categorías y que Go Big 2, 4 y 6 estén activos con precio y tamaño correctos.
2. Verificar precios con 1, 2, 3, 4, 5, 6, 8 y 10 cookies.
3. Realizar una compra de prueba en Mercado Pago con 4 y 6 sabores, verificar que `web_orders.items` contenga `flavors`.
4. Verificar una compra por WhatsApp y la atribución de ventas.
5. Revisar el diseño en iPhone y escritorio, enlaces directos, sitemap y las tarjetas al compartir.

**No se pudo ejecutar una compilación completa de Next.js en el entorno de creación** (las dependencias npm no están instaladas y la instalación no se completó). No subir a producción sin compilar y probar checkout.


## Corrección final: eliminación individual de sabores

Cada círculo lleno corresponde a una cookie concreta, en el mismo orden en que se agregó. Al sumar una cookie, el círculo muestra una marca de confirmación y anima su entrada; después aparece el icono de papelera. Al tocarlo se quita **una unidad del sabor correspondiente**. El botón «Editar mis sabores» despliega los nombres y cantidades con controles +/−. El total y el precio por caja se recalculan automáticamente. No requiere SQL nuevo.
