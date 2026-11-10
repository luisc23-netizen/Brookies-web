# Brookies — Estadísticas de ventas y WhatsApp

1. **ANTES de publicar:** abrir Supabase → SQL Editor, pegar y ejecutar TODO el archivo `MIGRACION_ESTADISTICAS_COMPLETA.sql`. El último SELECT debe mostrar `OK: esquema de estadísticas completo`. Es una migración idempotente: no borra registros.
2. Subir el contenido del ZIP a GitHub como en las actualizaciones anteriores; verificar Vercel Production Ready.
3. Probar una compra por WhatsApp con un producto de prueba. Al tocar «Comprar por WhatsApp», el servidor registra un pedido `whatsapp_intent` y después abre WhatsApp. No se solicita teléfono. Si Supabase falla, no se abre WhatsApp y se informa el error.
4. Abrir `/admin/estadisticas` y comprobar que aumenten las ventas y la facturación WhatsApp. Probar de nuevo el mismo botón sin cambiar el carrito: debe reutilizar el mismo pedido (no duplicar). Cambiar el carrito y probar otra vez para registrar una nueva intención.
5. Comprobar que Mercado Pago sigue redirigiendo normalmente y que solamente un pago `approved` suma facturación MP.

## Criterio de cifras
- WhatsApp = intención de compra registrada al tocar el botón, **no pago comprobado**. Incluye envío calculado cuando corresponda; las zonas a cotizar quedan sin envío.
- MP = solo pagos aprobados. Pendientes excluidos.
- Históricos: eventos `whatsapp_checkout` previos a esta versión se suman sin duplicar pedidos nuevos. Algunos eventos históricos no tienen nombres/precios unitarios para reconstruir productos vendidos.
- Visitas = cargas de página, no visitantes únicos.
- Días y horas: zona horaria Argentina.

## Tablas y campos cubiertos por la migración
- `web_orders`: id, created_at, items, delivery, address, note, shipping_fee, total, status, preference_id, payment_id, customer_name, attribution, payment_method, idempotency_key.
- `web_events`: id, created_at, event_type, items, attribution, total.

## Verificación en Supabase
```sql
select status, payment_method, count(*) pedidos, sum(total) importe
from public.web_orders group by status,payment_method order by status;
```

**Nota:** las ventas WhatsApp son una métrica comercial basada en clics confirmados por el backend, no una conciliación de dinero efectivamente cobrado.
