import Script from 'next/script';
import './style.css';
import AttributionClient from './attribution-client';
import BehaviorTracker from './behavior-tracker';
import type {Metadata} from 'next';
import {siteSettings} from '../lib/server';
const base=process.env.NEXT_PUBLIC_SITE_URL||'https://brookies.ar';
export async function generateMetadata():Promise<Metadata>{
 const s=await siteSettings();
 const seoTitle=s.seo_site_title?.trim()||'Brookies | Casa de galletitas · Cookies en Rosario';
 const socialTitle=s.social_share_title?.trim()||'Brookies - Casa de galletitas';
 const socialDescription=s.social_share_description?.trim()||'Elegí tus favoritas. Comprá online y coordiná el retiro o envío en Rosario.';
 return {verification:{google:'X5iqIioXQNpOKu0_Bau5GQrAMxd7yLbsyoEpd9zsACM'},metadataBase:new URL(base),title:{default:seoTitle,template:'%s | Brookies'},description:'Brookies, casa de cookies artesanales premium en Rosario. Cookies rellenas, cookies gourmet, sabores originales, boxes para regalar, regalos empresariales y pastelería artesanal.',openGraph:{type:'website',locale:'es_AR',siteName:'Brookies',title:socialTitle,description:socialDescription,images:[{url:'/opengraph-image',width:1200,height:630,alt:socialTitle}]},twitter:{card:'summary_large_image',title:socialTitle,description:socialDescription,images:['/opengraph-image']},robots:{index:true,follow:true}};
}
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es-AR"><body>
<Script id="brookies-gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NT34ZZKS');`}</Script>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NT34ZZKS" height="0" width="0" style={{display:'none',visibility:'hidden'}} title="Google Tag Manager"/></noscript>
<AttributionClient/><BehaviorTracker/>{children}</body></html>}
