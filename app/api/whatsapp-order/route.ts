import {isGoBig,cookieFlavor,isRosarioTuesday,promotionalPrice} from '../../../lib/box-pricing';
import {NextRequest,NextResponse} from 'next/server';
import {catalog,db,siteSettings} from '../../../lib/server';
import {sanitizeAttribution} from '../../../lib/attribution';
export const runtime='nodejs';
export async function POST(req:NextRequest){try{
 const body=await req.json();const key=String(body.idempotency_key||'');
 if(!/^[0-9a-f-]{36}$/i.test(key))return NextResponse.json({error:'Identificador inválido'},{status:400});
 const client=db();if(!client)return NextResponse.json({error:'Base de datos no disponible'},{status:503});
 const {data:existing,error:lookupError}=await client.from('web_orders').select('id,total').eq('idempotency_key',key).maybeSingle();if(lookupError)throw Error(lookupError.message);
 if(existing)return NextResponse.json({ok:true,id:existing.id,total:existing.total,duplicate:true});
 const customerName=String(body.customer_name||'').trim().replace(/\s+/g,' ').slice(0,120),delivery=String(body.delivery||''),address=String(body.address||'').trim().slice(0,300),note=String(body.note||'').trim().slice(0,1000);
 if(!customerName)return NextResponse.json({error:'Ingresá tu nombre'},{status:400});
 if(!['Retiro por el local','Envío dentro de Rosario','Otras zonas (a consultar)'].includes(delivery))return NextResponse.json({error:'Modalidad inválida'},{status:400});
 if(delivery!=='Retiro por el local'&&!address)return NextResponse.json({error:'Ingresá la dirección'},{status:400});
 if(!Array.isArray(body.items)||!body.items.length||body.items.length>50)return NextResponse.json({error:'Carrito inválido'},{status:400});
 const products=await catalog();const rows:{id:string;name:string;qty:number;unit_price:number;flavors:{id:string;name:string;qty:number}[]}[]=[];
 for(const line of body.items){const p=products.find(p=>p.id===line.id&&p.active!==false),qty=Number(line.qty);if(!p||!Number.isInteger(qty)||qty<1||qty>30||!Number.isFinite(Number(p.price))||Number(p.price)<=0)return NextResponse.json({error:'Producto o cantidad inválida'},{status:400});
 const flavors=Array.isArray(line.flavors)?line.flavors:[];if(p.is_tiny){const expected=Number(p.tiny_quantity);const allowed=products.filter(x=>x.active!==false&&x.available_as_tiny_flavor===true&&cookieFlavor(x));if(!Number.isInteger(expected)||expected<1||flavors.reduce((n:number,f:{qty:number})=>n+Number(f.qty||0),0)!==expected||flavors.some((f:{id:string;qty:number})=>!allowed.some(x=>x.id===f.id)||!Number.isInteger(Number(f.qty))||Number(f.qty)<1))return NextResponse.json({error:'Revisá los sabores Tiny'},{status:400});}else if(isGoBig(p)||p.product_type==='personalizable'&&p.box_size){const opts=products.filter(x=>x.active!==false&&cookieFlavor(x)&&!isGoBig(x));if(flavors.reduce((n:number,f:{qty:number})=>n+Number(f.qty||0),0)!==(Number(p.box_size)||Number((p.slug||p.name).match(/[246]/)?.[0]||0))||flavors.some((f:{id:string;qty:number})=>!opts.some(o=>o.id===f.id)||!Number.isInteger(Number(f.qty))||Number(f.qty)<1))return NextResponse.json({error:'Revisá los sabores de la box'},{status:400});}
 rows.push({id:p.id,name:p.name,qty,unit_price:promotionalPrice(p,products,isRosarioTuesday()),flavors:flavors.map((f:{id:string;qty:number})=>({id:f.id,name:products.find(p=>p.id===f.id)?.name||'',qty:Number(f.qty)}))});}
 const settings=await siteSettings(),fee=delivery==='Envío dentro de Rosario'?Number(settings.rosario_delivery_fee||4000):0;if(!Number.isFinite(fee)||fee<0)return NextResponse.json({error:'Envío inválido'},{status:500});
 const total=rows.reduce((n,r)=>n+r.qty*r.unit_price,0)+fee;
 const {data,error}=await client.from('web_orders').insert({items:rows,delivery,address,customer_name:customerName,note,shipping_fee:fee,total,status:'whatsapp_intent',payment_method:'whatsapp',idempotency_key:key,attribution:sanitizeAttribution(body.attribution)}).select('id').single();
 if(error){if(error.code==='23505'){const {data:previous}=await client.from('web_orders').select('id,total').eq('idempotency_key',key).maybeSingle();if(previous)return NextResponse.json({ok:true,id:previous.id,total:previous.total,duplicate:true});}console.error('WhatsApp order DB error',error.message,error.code);return NextResponse.json({error:'No se pudo registrar la compra por WhatsApp'},{status:500});}
 return NextResponse.json({ok:true,id:data.id,total});
 }catch(e){console.error('WhatsApp checkout error',e);return NextResponse.json({error:'No se pudo registrar la compra'},{status:500});}}
