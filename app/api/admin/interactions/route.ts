import {NextRequest,NextResponse} from 'next/server';
import {authorized,db} from '../../../../lib/server';
type Row={action:string;detail:string;session_id:string};
export async function GET(req:NextRequest){
 if(!await authorized())return NextResponse.json({error:'No autorizado'},{status:401});
 const client=db();if(!client)return NextResponse.json({error:'Sin DB'},{status:503});
 const raw=req.nextUrl.searchParams.get('days');
 const days=raw==='0'?0:Math.min(365,Math.max(1,Number(raw)||30));
 const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const since=days===0?new Date(today+'T03:00:00.000Z').toISOString():new Date(Date.now()-days*86400000).toISOString();
 const rows:Row[]=[];
 for(let i=0;i<100;i++){
  const {data,error}=await client.from('web_interactions').select('action,detail,session_id').gte('created_at',since).order('created_at',{ascending:false}).range(i*500,i*500+499);
  if(error)return NextResponse.json({error:error.message},{status:500});
  rows.push(...(data||[]));if(!data||data.length<500)break;
 }
 const groups=new Map<string,{action:string;detail:string;clicks:number;visitors:Set<string>}>();
 for(const r of rows){
  if(r.action==='product_view')continue;
  let detail=r.detail;
  if(detail.startsWith('{')){try{const d=JSON.parse(detail);detail=String(d.name||d.category||detail)}catch{}}
  const key=r.action+'|'+detail;
  if(!groups.has(key))groups.set(key,{action:r.action,detail,clicks:0,visitors:new Set()});
  const g=groups.get(key)!;g.clicks++;g.visitors.add(r.session_id);
 }
 return NextResponse.json({total:rows.length,uniqueVisitors:new Set(rows.map(r=>r.session_id)).size,actions:[...groups.values()].map(g=>({action:g.action,detail:g.detail,clicks:g.clicks,visitors:g.visitors.size})).sort((a,b)=>b.clicks-a.clicks)});
}
