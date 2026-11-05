# Brookies — integración Mercado Pago

1. Hacé backup de la versión publicada y de Supabase.
2. En Supabase > SQL Editor ejecutá `MIGRACION_PAGOS.sql`. Esto crea `web_orders` y `web_events` sin borrar tablas existentes.
3. En Vercel > Settings > Environments > Production verificá que exista `MP_ACCESS_TOKEN` (token de PRODUCCIÓN; nunca NEXT_PUBLIC). Verificá `NEXT_PUBLIC_SITE_URL=https://brookies.ar`, `NEXT_PUBLIC_WHATSAPP_NUMBER=5493412477553` y las credenciales existentes de Supabase.
4. Subí estos archivos a la rama `main` del repositorio y comprobá en Vercel que el deployment esté Ready. No hagas deploy hasta completar la migración.
5. Probá un pago real de importe pequeño controlado y verificá en Mercado Pago que el estado esté aprobado. La página `/pago/<id>` consulta a Mercado Pago desde el servidor antes de habilitar el botón de coordinación.
6. Probá las tres modalidades: retiro, Rosario con envío configurado, y otras zonas sin envío cobrado. Confirmá que WhatsApp reciba productos, sabores, dirección, importe y código de pago.

## Estadísticas
`web_events`: `cart_updated` (cada modificación del carrito) y `whatsapp_checkout` (clic; se contabiliza como intención/compra atribuida a WhatsApp, no pago verificado).
`web_orders`: `pending`, `approved`, `checkout_error`. Los pedidos aprobados se verifican contra la API de Mercado Pago. Los pendientes son pedidos que iniciaron Checkout Pro pero no tienen pago aprobado; no se pueden equiparar automáticamente a abandono definitivo.

## Consideraciones
No hay panel visual de estadísticas en `/admin` en esta versión: las tablas se pueden consultar desde Supabase. Tampoco se realiza el envío automático de WhatsApp: el cliente debe tocar «Coordinar envío». Para métricas de abandono completas entre sesiones, implementar identificador de carrito y consentimiento de analítica en una iteración posterior.
El botón de WhatsApp abre el chat con el pedido, pero no confirma una venta real ni un pago. No guardar ni mostrar el token en GitHub.
