import {NextRequest,NextResponse} from 'next/server';
import {authorized,db} from '../../../../lib/server';
export const dynamic='force-dynamic';
type Attr={last_campaign?:string;first_campaign?:string;last_source?:string;first_source?:string};
type Row={name:string;visits:number;carts:number;checkoutStarts:number;whatsapp:number;whatsappRevenue:number;approved:number;revenue:number;pending:number};
type Item={id?:string;name?:string;qty?:number;unit_price?:number};
const source=(a:Attr|null)=>a?.last_source||a?.first_source||'directo_desconocido';
const campaign=(a:Attr|null)=>a?.last_campaign||a?.first_campaign||'sin_campana';
const tz='America/Argentina/Buenos_Aires';
const dayFmt=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'});
const hourFmt=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',hourCycle:'h23'});
export async function GET(req:NextRequest){
 if(!await authorized())return NextResponse.json({error:'No autorizado'},{status:401});const client=db();if(!client)return NextResponse.json({error:'Base de datos no configurada'},{status:503});
 const rawDays=req.nextUrl.searchParams.get('days');const days=rawDays==='0'?0:Math.min(365,Math.max(1,Number(rawDays)||30));const localDay=new Intl.DateTimeFormat('sv-SE',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const since=days===0?new Date(localDay+'T03:00:00.000Z').toISOString():new Date(Date.now()-days*86400000).toISOString();
 const orders:Record<string,unknown>[]=[],events:Record<string,unknown>[]=[];
 for(let i=0;i<100;i++){const {data,error}=await client.from('web_orders').select('id,created_at,total,status,items,attribution,payment_method,shipping_fee').gte('created_at',since).order('created_at',{ascending:false}).range(i*500,i*500+499);if(error)return NextResponse.json({error:error.message},{status:500});orders.push(...(data||[]));if(!data||data.length<500)break}
 for(let i=0;i<100;i++){const {data,error}=await client.from('web_events').select('id,created_at,event_type,total,attribution,items').gte('created_at',since).order('created_at',{ascending:false}).range(i*500,i*500+499);if(error)return NextResponse.json({error:error.message},{status:500});events.push(...(data||[]));if(!data||data.length<500)break}
 const campaigns=new Map<string,Row>(),sources=new Map<string,Row>();
 function target(m:Map<string,Row>,name:string){if(!m.has(name))m.set(name,{name,visits:0,carts:0,checkoutStarts:0,whatsapp:0,whatsappRevenue:0,approved:0,revenue:0,pending:0});return m.get(name)!}
 const summary={visits:0,carts:0,checkoutStarts:0,whatsapp:0,whatsappRevenue:0,approved:0,revenue:0,pending:0};
 const daily=new Map<string,{day:string;mp:number;whatsapp:number;orders:number}>();const hourly=new Map<number,{hour:string;mp:number;whatsapp:number;orders:number}>();const products=new Map<string,{name:string;units:number;revenue:number}>();
 function sale(time:unknown,channel:'mp'|'whatsapp',amount:number,items:unknown){const date=new Date(String(time));if(Number.isNaN(date.getTime()))return;const d=dayFmt.format(date),h=Number(hourFmt.format(date));if(!daily.has(d))daily.set(d,{day:d,mp:0,whatsapp:0,orders:0});if(!hourly.has(h))hourly.set(h,{hour:String(h).padStart(2,'0')+':00',mp:0,whatsapp:0,orders:0});for(const b of [daily.get(d)!,hourly.get(h)!]){b[channel]+=amount;b.orders++}for(const item of (Array.isArray(items)?items:[]) as Item[]){const name=String(item.name||item.id||'Sin identificar'),qty=Number(item.qty)||0,price=Number(item.unit_price)||0;if(!products.has(name))products.set(name,{name,units:0,revenue:0});const p=products.get(name)!;p.units+=qty;p.revenue+=qty*price}}
 for(const e of events){const a=e.attribution as Attr|null;for(const t of [target(campaigns,campaign(a)),target(sources,source(a))]){if(e.event_type==='page_view')t.visits++;if(e.event_type==='cart_updated')t.carts++;if(e.event_type==='checkout_started')t.checkoutStarts++;}if(e.event_type==='page_view')summary.visits++;if(e.event_type==='cart_updated')summary.carts++;if(e.event_type==='checkout_started')summary.checkoutStarts++;
 // Eventos históricos anteriores al registro de pedidos WhatsApp: conservarlos sin duplicar pedidos nuevos.
 if(e.event_type==='whatsapp_checkout'){const amount=Number(e.total)||0;summary.whatsapp++;summary.whatsappRevenue+=amount;for(const t of [target(campaigns,campaign(a)),target(sources,source(a))]){t.whatsapp++;t.whatsappRevenue+=amount;}sale(e.created_at,'whatsapp',amount,e.items)} }
 for(const o of orders){const a=o.attribution as Attr|null,amount=Number(o.total)||0;const targets=[target(campaigns,campaign(a)),target(sources,source(a))];if(o.status==='approved'){summary.approved++;summary.revenue+=amount;for(const t of targets){t.approved++;t.revenue+=amount}sale(o.created_at,'mp',amount,o.items)}else if(o.status==='whatsapp_intent'){summary.whatsapp++;summary.whatsappRevenue+=amount;for(const t of targets){t.whatsapp++;t.whatsappRevenue+=amount}sale(o.created_at,'whatsapp',amount,o.items)}else if(o.status==='pending'){summary.pending++;for(const t of targets)t.pending++}}
 const sort=(m:Map<string,Row>)=>[...m.values()].sort((a,b)=>(b.revenue+b.whatsappRevenue)-(a.revenue+a.whatsappRevenue)||b.visits-a.visits);
 return NextResponse.json({days,summary,campaigns:sort(campaigns),sources:sort(sources),daily:[...daily.values()].sort((a,b)=>a.day.localeCompare(b.day)),hourly:[...hourly.values()].sort((a,b)=>a.hour.localeCompare(b.hour)),products:[...products.values()].sort((a,b)=>b.units-a.units)});
}
