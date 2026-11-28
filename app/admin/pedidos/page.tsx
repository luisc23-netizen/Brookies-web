import {authorized,db} from '../../../lib/server';
export const dynamic='force-dynamic';
type Flavor={name?:string;qty?:number};
type Item={name?:string;qty?:number;unit_price?:number;flavors?:Flavor[]};
const money=(n:unknown)=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(n)||0);
const status:Record<string,string>={whatsapp_intent:'WhatsApp iniciado · sin confirmar',approved:'Pago aprobado',pending:'Pago pendiente',rejected:'Pago rechazado',cancelled:'Cancelado'};
export default async function Page({searchParams}:{searchParams:Promise<{page?:string}>}){
 if(!await authorized())return <main className="admin"><h1>Acceso restringido</h1><a href="/admin">Ingresar</a></main>;
 const client=db();if(!client)return <main className="admin">Base de datos no disponible.</main>;
 const page=Math.max(1,Math.min(10000,Math.floor(Number((await searchParams).page)||1)));
 const {data,error}=await client.from('web_orders').select('id,created_at,customer_name,items,delivery,address,note,shipping_fee,total,status,payment_method').order('created_at',{ascending:false}).order('id',{ascending:false}).range((page-1)*50,page*50-1);
 return <main className="admin"><a href="/admin">← Administrador</a><h1>Pedidos registrados</h1><p>Los pedidos iniciados por WhatsApp no implican que el cliente haya enviado el mensaje ni pagado.</p>{error?<p role="alert">No se pudieron consultar los pedidos: {error.message}</p>:<>{!data?.length&&<p>No hay pedidos en esta página.</p>}{(data||[]).map(o=><article key={o.id} style={{border:'1px solid #ccc',borderRadius:12,padding:16,margin:'16px 0'}}><h2>{o.customer_name||'Sin nombre'} · {money(o.total)}</h2><p>{new Date(o.created_at).toLocaleString('es-AR',{timeZone:'America/Argentina/Buenos_Aires'})} · {status[o.status]||o.status} · {o.payment_method||'Sin método'}</p><p>{o.delivery} {o.address}</p>{o.note&&<p>Observaciones: {o.note}</p>}<ul>{(Array.isArray(o.items)?o.items as Item[]:[]).map((item,i)=><li key={i}>{item.qty} × {item.name} — {money(item.unit_price)} c/u{Array.isArray(item.flavors)&&item.flavors.length>0&&<ul>{item.flavors.map((f,j)=><li key={j}>{f.qty} × {f.name}</li>)}</ul>}</li>)}</ul><p>Envío: {money(o.shipping_fee)} · Total: {money(o.total)}</p><small>Pedido {o.id}</small></article>)}<nav style={{display:'flex',gap:24}}>{page>1&&<a href={'?page='+(page-1)}>← Anterior</a>}{data?.length===50&&<a href={'?page='+(page+1)}>Siguiente →</a>}</nav></>}</main>;
}
