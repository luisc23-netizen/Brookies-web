import './style.css';
import AttributionClient from './attribution-client';
import type {Metadata} from 'next';
import {siteSettings} from '../lib/server';
const base=process.env.NEXT_PUBLIC_SITE_URL||'https://brookies.ar';
export async function generateMetadata():Promise<Metadata>{
 const s=await siteSettings();
 const seoTitle=s.seo_site_title?.trim()||'Brookies | Casa de galletitas · Cookies en Rosario';
 const socialTitle=s.social_share_title?.trim()||'Brookies - Casa de galletitas';
 const socialDescription=s.social_share_description?.trim()||'Elegí tus favoritas. Comprá online y coordiná el retiro o envío en Rosario.';
 return {metadataBase:new URL(base),title:{default:seoTitle,template:'%s | Brookies'},description:'Brookies, casa de cookies artesanales premium en Rosario. Cookies rellenas, cookies gourmet, sabores originales, boxes para regalar, regalos empresariales y pastelería artesanal.',openGraph:{type:'website',locale:'es_AR',siteName:'Brookies',title:socialTitle,description:socialDescription,images:[{url:'/opengraph-image',width:1200,height:630,alt:socialTitle}]},twitter:{card:'summary_large_image',title:socialTitle,description:socialDescription,images:['/opengraph-image']},robots:{index:true,follow:true}};
}
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es-AR"><body><AttributionClient/>{children}</body></html>}
