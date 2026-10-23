# Corrección Royal y Pequeños detalles (23/10/2026)

- Las colecciones especiales Royal y Pequeños detalles se obtienen directamente de los productos activos de Supabase, sin depender de los filtros del catálogo general ni de un listado manual de IDs.
- Se toleran diferencias de mayúsculas y tildes en los nombres de categorías.
- Se mejora el espacio del carrito en pantallas pequeñas.
- No se modifica la base de datos. No ejecutar SQL ni importar productos.
- Reemplazar el proyecto completo en GitHub, conservar variables de Vercel y comprobar que el nuevo deployment llegue a Ready.
- Si un producto activo sigue sin aparecer, revisar Runtime Logs para detectar errores en la lectura del catálogo; no duplicar productos.

La verificación local de compilación completa requiere instalar dependencias; el ZIP fue validado estructuralmente.
