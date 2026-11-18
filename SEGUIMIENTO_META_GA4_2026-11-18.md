# Seguimiento de conversiones Brookies — 18/11/2026

Se parte del ZIP `Brookies-Ajustes-Carrito-Likes-2026-11-15.zip`, que ya incluye las correcciones de martes, likes y GTM `GTM-NT34ZZKS`. No cambia precios ni descuentos.

## Eventos incluidos

| Acción | Meta Pixel | dataLayer (GA4) |
| --- | --- | --- |
| Producto visible en el carrusel | ViewContent | view_item |
| Botón AGREGAR | AddToCart | add_to_cart |
| Ver mi pedido y comprar | InitiateCheckout | begin_checkout |
| Iniciar Mercado Pago | AddPaymentInfo | add_payment_info |
| Pago Mercado Pago aprobado | Purchase | purchase |
| Pedido enviado por WhatsApp | Contact | contact |
| Solicitar presupuesto de Empresas | Lead | generate_lead |

**Importante:** el pixel de Meta ya está instalado en Google Tag Manager. Esta actualización **no instala otro píxel**: envía eventos a `window.fbq` cuando el tag de Meta esté cargado. Mantener el tag base `PageView` activo en todas las páginas. No duplicar estos eventos creando etiquetas Meta equivalentes en GTM.

Los eventos GA4 se colocan en `dataLayer` con sus datos ecommerce. Para recibirlos en GA4 hay que crear en GTM las etiquetas GA4 Event y sus activadores de **evento personalizado** (`view_item`, `add_to_cart`, `begin_checkout`, `add_payment_info`, `purchase`, `contact`, `generate_lead`) y enviar los parámetros `ecommerce.*` pertinentes; la etiqueta base de GA4 no los envía automáticamente. `PageView` sigue a cargo de la etiqueta Meta existente.

El evento `Purchase` se emite **solo cuando la página de pago verifica `approved`**, nunca al abrir Mercado Pago. Se evita repetir el evento en el mismo navegador para un mismo ID de pedido. Esto no garantiza deduplicación entre dispositivos; una integración futura con API de conversiones debería usar un `event_id` estable y evitar contar duplicados.

Los importes de `Purchase` incluyen lo cobrado por Mercado Pago (productos + envío cobrado). Los precios de `AddToCart` son de la unidad seleccionada; el descuento 4×3 se refleja en el valor del carrito en `begin_checkout`, calculado por el sistema existente.

**Prueba:** publicar el ZIP, entrar en Meta > Brookies Web (ID `2388527688556008`) > Probar eventos, navegar por productos, agregar, iniciar checkout, solicitar presupuesto. Para probar `Purchase`, realizar un pago real de prueba y verificar su aprobación. En GTM Preview verificar también el `dataLayer`.
