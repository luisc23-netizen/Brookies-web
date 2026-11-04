# Corrección de catálogo y Go Big — 4 noviembre 2026

- El botón «VER TODAS LAS BROOKIES» muestra todas las cookies individuales activas de la categoría «Colección de Cookies».
- El filtro «Colección de Cookies» utiliza exactamente esa misma lista.
- Los selectores Go Big 2, 4 y 6 reutilizan esa lista, sin límite fijo ni selección manual de sabores.
- La lista se ordena por `sort_order` y se actualiza desde la base de datos en cada carga.
- Se conservan las demás secciones, los productos Royal y los accesorios.

No se requiere ejecutar SQL. No se ha podido completar `npm run build` en este entorno (instalación de dependencias no finalizada); verificar el build de Vercel antes de dar por publicada la corrección.
