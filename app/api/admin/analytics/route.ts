import {NextRequest,NextResponse} from 'next/server';
import {authorized,db} from '../../../../lib/server';
export const dynamic='force-dynamic';
type Attr={last_campaign?:string;first_campaign?:string;last_source?:string;first_source?:string};
type Row={name:string;visits:number;carts:number;whatsapp:number;approved:number;revenue:number;pending:number};
const source=(a:Attr|null)=>a?.last_source||a?.first_source||'directo_desconocido';
const campaign=(a:Attr|null)=>a?.last_campaign||a?.first_campaign||'sin_campana';
export async function GET(req:NextRequest){if(!await authorized())return NextResponse.json({error:'No autorizado'},{status:401});const client=db();if(!client)return NextResponse.json({error:'Base de datos no configurada'},{status:503});const days=Math.min(365,Math.max(1,Number(req.nextUrl.searchParams.get('days'))||30));const since=new Date(Date.now()-days*86400000).toISOString();
const orders:Record<string,unknown>[]=[];const events:Record<string,unknown>[]=[];
for(let i=0;i<100;i++){const {data,error}=await client.from('web_orders').select('id,created_at,total,status,items,attribution').gte('created_at',since).order('created_at',{ascending:false}).range(i*500,i*500+499);if(error)return NextResponse.json({error:error.message},{status:500});orders.push(...(data||[]));if(!data||data.length<500)break}
for(let i=0;i<100;i++){const {data,error}=await client.from('web_events').select('id,created_at,event_type,total,attribution').gte('created_at',since).order('created_at',{ascending:false}).range(i*500,i*500+499);if(error)return NextResponse.json({error:error.message},{status:500});events.push(...(data||[]));if(!data||data.length<500)break}
const campaigns=new Map<string,Row>();const sources=new Map<string,Row>();
function target(m:Map<string,Row>,name:string){if(!m.has(name))m.set(name,{name,visits:0,carts:0,whatsapp:0,approved:0,revenue:0,pending:0});return m.get(name)!}
for(const e of events){const a=e.attribution as Attr|null;for(const t of [target(campaigns,campaign(a)),target(sources,source(a))]){if(e.event_type==='page_view')t.visits++;if(e.event_type==='cart_updated')t.carts++;if(e.event_type==='whatsapp_checkout')t.whatsapp++}}
for(const o of orders){const a=o.attribution as Attr|null;for(const t of [target(campaigns,campaign(a)),target(sources,source(a))]){if(o.status==='approved'){t.approved++;t.revenue+=Number(o.total)||0}else if(o.status==='pending')t.pending++}}
const sort=(m:Map<string,Row>)=>[...m.values()].sort((a,b)=>b.revenue-a.revenue||b.visits-a.visits);
return NextResponse.json({days,summary:{visits:events.filter(e=>e.event_type==='page_view').length,carts:events.filter(e=>e.event_type==='cart_updated').length,whatsapp:events.filter(e=>e.event_type==='whatsapp_checkout').length,approved:orders.filter(o=>o.status==='approved').length,revenue:orders.filter(o=>o.status==='approved').reduce((n,o)=>n+(Number(o.total)||0),0),pending:orders.filter(o=>o.status==='pending').length},campaigns:sort(campaigns),sources:sort(sources)});
}
