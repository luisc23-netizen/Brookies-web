# Nombre del cliente en checkout

1. En Supabase SQL Editor ejecutá `MIGRACION_NOMBRE_PEDIDO.sql`.
2. Subí los archivos del proyecto a GitHub y esperá el despliegue de Vercel.
3. Probá una compra de retiro y otra de envío. El nombre es obligatorio antes de pagar con Mercado Pago o abrir WhatsApp. No se solicita teléfono.
4. Confirmá que `web_orders.customer_name` contenga el nombre y que aparezca en la pantalla posterior al pago y en el mensaje de coordinación.

Los pedidos anteriores quedan con `customer_name` nulo. Se conservan las estadísticas y el seguimiento de campañas de la versión anterior.
