# Corrección del selector Go Big

- Las Go Big muestran todos los productos activos (`active = true`) de la categoría `Colección de Cookies`, salvo los productos personalizables.
- El catálogo se consulta completo por páginas de 500 registros, sin depender de límites implícitos.
- La página pública se genera con datos actuales en cada solicitud, sin conservar una versión ISR de 60 segundos.
- Se normalizan espacios y acentos al comparar la categoría.
- No se modifican datos ni estructura de Supabase.

**Si Blue Velvet sigue sin aparecer:** comprobar en Supabase que su registro tenga `active = true`, `category = Colección de Cookies` y que no exista una discrepancia entre el proyecto de Supabase usado por el admin y el de Vercel. El ZIP no puede verificar la base remota.
