import {merchantProducts,metaCSV} from '../../../lib/merchant-feed';
export const dynamic='force-dynamic';
export async function GET(){try{const products=await merchantProducts();return new Response(metaCSV(products),{headers:{'Content-Type':'text/csv; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=3600','Content-Disposition':'inline; filename="brookies-meta.csv"'}});}catch(e){console.error('Meta feed:',e);return new Response('Feed temporalmente no disponible',{status:503});}}
