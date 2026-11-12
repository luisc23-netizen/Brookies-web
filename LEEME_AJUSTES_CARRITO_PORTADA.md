# Ajustes de conversión — portada y carrito

- Admin > Contenido: texto y producto del botón principal de portada, sin migración de esquema; son claves nuevas en `site_settings`.
- El botón llama al mismo selector que la tarjeta del producto seleccionado. Para productos no personalizables, agrega al carrito directamente.
- Los sabores muestran la descripción existente del producto debajo del nombre.
- El aviso de coordinación aparece inmediatamente debajo de «Tu pedido».
- «Agregar box» abre el carrito automáticamente.
- «Sin descuento» en WhatsApp solo aparece durante la franja nocturna.
- Para cambiar el producto en el admin, guardá el contenido y recargá la portada.
- El descuento nocturno continúa siendo 15% únicamente en Mercado Pago de 21:00 a 08:00.
- No requiere migración SQL.
- Antes de publicar: comprobar la compilación en Vercel y probar la compra con Mercado Pago.
