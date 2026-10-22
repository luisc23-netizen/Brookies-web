import './style.css';import type {Metadata} from 'next';
const base=process.env.NEXT_PUBLIC_SITE_URL||'https://example.com';
export const metadata:Metadata={metadataBase:new URL(base),title:{default:'Brookies | Cookies de autor en Rosario',template:'%s | Brookies Rosario'},description:'Cookies de autor en Rosario. Descubrí sabores originales, cajas para regalar y pedidos directos. Brookies: no son cookies ordinarias.',openGraph:{type:'website',locale:'es_AR',siteName:'Brookies',title:'Brookies — Cookies de autor en Rosario',description:'Cookies originales, cajas para regalar y pedidos directos en Rosario.'},robots:{index:true,follow:true}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es-AR"><body>{children}</body></html>}
