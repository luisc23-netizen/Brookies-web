# Brookies After Dark — 15% solo Mercado Pago

- Horario: todos los días de 21:00 a 07:59:59, zona America/Argentina/Buenos_Aires.
- Descuento: 15% sobre los PRODUCTOS; no se descuenta el costo de envío.
- WhatsApp: no tiene descuento y se registra a precio completo.
- El servidor valida el horario y calcula precios reales al crear la preferencia de Mercado Pago. No acepta precios enviados por el navegador.
- Los importes descontados quedan registrados en `web_orders.items[].unit_price` y `web_orders.total` y se usan para Mercado Pago y estadísticas.
- No requiere cambios en Supabase: se reutilizan columnas existentes.
- El descuento se determina al INICIAR el checkout. Si se inicia antes de las 08:00 y se paga más tarde, Mercado Pago mantiene el precio de esa preferencia.
- Antes de subir a producción, hacer una prueba con reloj real dentro y fuera de la franja, y verificar que Mercado Pago cobre exactamente lo mostrado.
- No modifica el estado de las órdenes ni el webhook.
