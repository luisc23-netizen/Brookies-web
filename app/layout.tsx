import './style.css';
import AttributionClient from './attribution-client';import type {Metadata} from 'next';
const base=process.env.NEXT_PUBLIC_SITE_URL||'https://brookies.ar';
export const metadata:Metadata={metadataBase:new URL(base),title:{default:'Brookies | Casa de galletitas · Cookies en Rosario',template:'%s | Brookies'},description:'Brookies, casa de cookies artesanales premium en Rosario. Cookies rellenas, cookies gourmet, sabores originales, boxes para regalar, regalos empresariales y pastelería artesanal.',openGraph:{type:'website',locale:'es_AR',siteName:'Brookies',title:'Brookies - Casa de galletitas',description:'Elegí tus favoritas. Comprá online y coordiná el retiro o envío en Rosario.',images:[{url:'/opengraph-image',width:1200,height:630}]},twitter:{card:'summary_large_image'},robots:{index:true,follow:true}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es-AR"><body><AttributionClient/>{children}</body></html>}
