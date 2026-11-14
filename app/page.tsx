import {catalog,siteSettings} from '../lib/server';
import Store from './store';
import {Metadata} from 'next';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Brookies | Casa de galletitas · Cookies en Rosario'};
export default async function Home(){const [products,settings]=await Promise.all([catalog(),siteSettings()]);const url=process.env.NEXT_PUBLIC_SITE_URL||'https://brookies.ar';const schema={'@context':'https://schema.org','@type':'Bakery',name:'Brookies',url,description:'Casa de cookies artesanales premium en Rosario. Cookies rellenas, cookies gourmet, boxes para regalar y regalos empresariales.',address:{'@type':'PostalAddress',streetAddress:'Salta 1525',addressLocality:'Rosario',addressRegion:'Santa Fe',addressCountry:'AR'},telephone:'+54 341 247-7553',sameAs:['https://www.instagram.com/brookies.brk/']};return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/><Store products={products} settings={settings}/></>}
