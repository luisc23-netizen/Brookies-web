# Brookies - actualización 2026-10-23

Partir del ZIP de corrección de compilación 01. No volver a ejecutar `supabase.sql` ni la migración si ya se aplicó. Esta tanda utiliza columnas existentes y agrega claves a `site_settings` automáticamente desde /admin; no requiere SQL adicional.

1. Respaldar GitHub y las tablas products y site_settings.
2. Subir el CONTENIDO de Brookies-web-main a la raíz del repositorio (no la carpeta contenedora).
3. Verificar Vercel Build Logs y Ready antes de usar producción.
4. Desde /admin: seleccionar los productos destacados de portada; configurar el producto Tiny para celebraciones; seleccionar otros productos de celebraciones; cargar imágenes; editar etiqueta BEST SELLER; seleccionar productos de regalo; asignar paquetes a categoría Royal y accesorios a Pequeños detalles.
5. La opción de Tiny variadas agrega 10 Tiny surtidas según stock como observación explícita del pedido. El producto original no se duplica ni se modifica su ID. Para otras cajas, configurar tipo personalizable, capacidad y productos de sabores en /admin.
6. La categoría Royal aparece en su sección exclusiva y como complemento del carrito; Pequeños detalles no aparece en el listado general, pero sí en complementos y eventos.
7. No se incluye información de productos ni claves privadas en este ZIP.

Validación: archivos TSX revisados con parser TypeScript y ZIP verificado; no se pudo instalar dependencias offline para ejecutar Next build completo.
