import {NextRequest,NextResponse} from 'next/server';
import {catalog,db,siteSettings} from '../../../lib/server';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 try{
  const token=process.env.MP_ACCESS_TOKEN;if(!token)return NextResponse.json({error:'Mercado Pago todavía no está configurado'},{status:503});
  const body=await req.json();const items=body.items;
  if(!Array.isArray(items)||!items.length||items.length>50)return NextResponse.json({error:'Carrito inválido'},{status:400});
  const delivery=body.delivery;
  if(!['Retiro por el local','Envío dentro de Rosario','Otras zonas (a consultar)'].includes(delivery))return NextResponse.json({error:'Modalidad inválida'},{status:400});
  const address=String(body.address||'').trim().slice(0,300),note=String(body.note||'').slice(0,1000);
  if(delivery!=='Retiro por el local'&&!address)return NextResponse.json({error:'Ingresá tu dirección'},{status:400});
  const products=await catalog();const rows=[] as {id:string;name:string;qty:number;unit_price:number;flavors:{id:string;name:string;qty:number}[]}[];
  for(const line of items){const product=products.find(p=>p.id===line.id&&p.active!==false);const qty=Number(line.qty);if(!product||!Number.isInteger(qty)||qty<1||qty>30||!Number.isFinite(Number(product.price))||Number(product.price)<=0)return NextResponse.json({error:'Producto o cantidad inválida'},{status:400});
   const flavors=Array.isArray(line.flavors)?line.flavors:[];
   if(product.product_type==='personalizable'&&product.box_size){const options=products.filter(p=>p.active!==false&&p.product_type!=='personalizable'&&String(p.category||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()==='coleccion de cookies');if(flavors.reduce((n:number,f:{qty:number})=>n+Number(f.qty||0),0)!==product.box_size||flavors.some((f:{id:string;qty:number})=>!options.some(o=>o.id===f.id)||!Number.isInteger(Number(f.qty))||Number(f.qty)<1))return NextResponse.json({error:'Revisá los sabores de la box'},{status:400});}
   rows.push({id:product.id,name:product.name,qty,unit_price:Number(product.price),flavors:flavors.map((f:{id:string;qty:number})=>({id:f.id,name:products.find(p=>p.id===f.id)?.name||'',qty:Number(f.qty)}))});
  }
  const settings=await siteSettings();const fee=delivery==='Envío dentro de Rosario'?Number(settings.rosario_delivery_fee||4000):0;
  if(!Number.isFinite(fee)||fee<0)return NextResponse.json({error:'Envío mal configurado'},{status:500});
  const total=rows.reduce((n,r)=>n+r.qty*r.unit_price,0)+fee;
  const client=db();if(!client)return NextResponse.json({error:'Base de datos no disponible'},{status:503});
  const {data:order,error}=await client.from('web_orders').insert({items:rows,delivery,address,note,shipping_fee:fee,total,status:'pending'}).select('id').single();if(error||!order)throw Error('No se pudo guardar el pedido. Ejecutá la migración de pedidos.');
  const origin=(process.env.NEXT_PUBLIC_SITE_URL||req.nextUrl.origin).replace(/\/$/,'');
  const preference={items:[...rows.map(r=>({id:r.id,title:r.name,quantity:r.qty,unit_price:r.unit_price,currency_id:'ARS'})),...(fee>0?[{id:'shipping',title:'Envío dentro de Rosario',quantity:1,unit_price:fee,currency_id:'ARS'}]:[])],external_reference:order.id,back_urls:{success:`${origin}/pago/${order.id}`,failure:`${origin}/pago/${order.id}`,pending:`${origin}/pago/${order.id}`},auto_return:'approved',notification_url:`${origin}/api/mp-webhook`};
  const response=await fetch('https://api.mercadopago.com/checkout/preferences',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(preference),cache:'no-store'});
  const mp=await response.json();if(!response.ok||!mp.init_point){await client.from('web_orders').update({status:'checkout_error'}).eq('id',order.id);throw Error('Mercado Pago no pudo crear el pago');}
  await client.from('web_orders').update({preference_id:mp.id}).eq('id',order.id);
  return NextResponse.json({url:mp.init_point});
 }catch(e){console.error('Checkout error',e);return NextResponse.json({error:e instanceof Error?e.message:'Error de pago'},{status:500})}
}
