# Brookies — Mejoras de conversión (12/11/2026)

- Portada: CTA «ARMÁ TU CAJA DE 4», retiro y envío en Rosario con precio leído de `site_settings.rosario_delivery_fee`, cinco estrellas decorativas (no representan reseñas verificadas).
- Checkout: Mercado Pago primero, WhatsApp secundario («ENVIAR MI PEDIDO POR WHATSAPP»). Sin fecha u horario obligatorio; coordinación posterior.
- Carrito: sugerencia Go Big 4 para una sola cookie, sin agregar productos automáticamente.
- Catálogo: retirada la advertencia genérica de consultar disponibilidad/ingredientes/alérgenos.
- Estadísticas: filtro «Hoy», desde medianoche en America/Argentina/Buenos_Aires, distinto de últimas 24 horas.

## Base de datos
No se agregaron tablas ni columnas. No requiere SQL nuevo. El envío usa la configuración existente `rosario_delivery_fee`.

## Verificaciones pendientes
Compilar con `npm install && npm run build` y probar flujo de pago y WhatsApp en Preview antes de publicar en producción. El seguimiento de ventas sigue contando WhatsApp al enviar pedido, y MP solo aprobado.
