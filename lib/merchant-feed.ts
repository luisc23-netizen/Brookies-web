import {catalog,db} from './server';
import type {Product} from './data';

const site=(process.env.NEXT_PUBLIC_SITE_URL||'https://brookies.ar').replace(/\/$/,'');
const xmlEscape=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const csv=(s:string)=>'"'+s.replace(/"/g,'""')+'"';
const absolute=(url:string)=>new URL(url,site).toString();
const validImage=(p:Product)=>{try {const u=new URL(p.image,site);return ['https:','http:'].includes(u.protocol)&&!!u.hostname;}catch{return false;}};

// Never publish demo/sample products as real merchandise when credentials are missing.
export async function merchantProducts(){
 if(!db())throw new Error('Supabase no configurado para el catálogo comercial');
 const products=await catalog();
 return products.filter(p=>p.active&&p.price>0&&!!p.slug&&!!p.name&&validImage(p));
}
function details(p:Product){return {id:p.id||p.slug,title:p.name,description:(p.description||`Producto de Brookies, casa de galletitas en Rosario.`).replace(/\s+/g,' ').trim(),link:`${site}/productos/${encodeURIComponent(p.slug)}`,image: absolute(p.image),price:`${p.price.toFixed(2)} ARS`};}
export function metaCSV(products:Product[]){const cols=['id','title','description','availability','condition','price','link','image_link','brand'];return '\uFEFF'+[cols.join(','),...products.map(p=>{const x=details(p);return [x.id,x.title,x.description,'in stock','new',x.price,x.link,x.image,'Brookies'].map(v=>csv(String(v))).join(',');})].join('\r\n')+'\r\n';}
export function googleXML(products:Product[]){return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>Brookies · Casa de galletitas</title><link>${xmlEscape(site)}</link><description>Productos Brookies en Rosario, Argentina</description>${products.map(p=>{const x=details(p);return `<item><g:id>${xmlEscape(String(x.id))}</g:id><title>${xmlEscape(x.title)}</title><description>${xmlEscape(x.description)}</description><link>${xmlEscape(x.link)}</link><g:image_link>${xmlEscape(x.image)}</g:image_link><g:availability>in_stock</g:availability><g:condition>new</g:condition><g:price>${xmlEscape(x.price)}</g:price><g:brand>Brookies</g:brand><g:identifier_exists>no</g:identifier_exists></item>`;}).join('')}</channel></rss>`;}
