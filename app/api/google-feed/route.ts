import {merchantProducts,googleXML} from '../../../lib/merchant-feed';
export const dynamic='force-dynamic';
export async function GET(){try{const products=await merchantProducts();return new Response(googleXML(products),{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=3600'}});}catch(e){console.error('Google feed:',e);return new Response('Feed temporalmente no disponible',{status:503});}}
