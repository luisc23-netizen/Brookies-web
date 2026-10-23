# Brookies — corrección de Royal, Celebraciones y carrito

Esta versión parte de Brookies-mejoras-completas-2026-10-23.zip. No incluye datos de Supabase ni altera productos existentes. No ejecutar supabase.sql ni MIGRACION_SEGURA.sql nuevamente si ya se aplicó.

## Cambios
- Reconocimiento de categorías Royal y Pequeños detalles insensible a mayúsculas, acentos y denominaciones que incluyan esas palabras (p. ej. «Royal · paquetes»).
- Royal aparece inmediatamente después de «Elegí tus Brookies» y sus productos se sugieren con foto, nombre, precio y botón + en el carrito. Pequeños detalles aparece antes de Royal en el carrito.
- Si no hay productos elegibles, se muestra una indicación de configuración en lugar de un espacio en blanco.
- «Armá tu celebración» muestra directamente todos los productos activos cuya categoría sea «Celebraciones» (o «Eventos»). Eliminada la lógica de Tiny destacada, opción de sabores variados y selección múltiple del administrador.
- «Frase animada de la web» aparece al comienzo de Contenido en /admin con el texto actual como valor inicial editable. Guardar con «Guardar contenido».

## Comprobar en /admin
1. Cada paquete Royal debe tener categoría Royal (o una denominación que contenga Royal), estar marcado «Visible en la web» y la categoría también debe estar visible.
2. Cada tarjeta/accesorio debe tener categoría «Pequeños detalles» (o denominación que incluya «detalle») y estar visible.
3. Cada producto para eventos debe tener categoría «Celebraciones» y estar visible. No hay selección manual adicional.
4. Después de editar la cinta animada, pulsar «Guardar contenido». La portada pública puede tardar hasta 60 segundos en refrescarse.

## Publicación segura
Crear una copia del repositorio, subir el contenido de esta carpeta conservando su estructura y comprobar Vercel Deployments > Build Logs. No se ha completado una compilación local por indisponibilidad de dependencias en este entorno. Si el despliegue falla, mantener la versión anterior en producción y compartir el primer error.
