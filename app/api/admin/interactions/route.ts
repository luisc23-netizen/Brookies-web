import {NextRequest,NextResponse} from 'next/server';
import {authorized,db} from '../../../../lib/server';
type Row={action:string;detail:string;session_id:string;created_at:string;id:number};
export async function GET(req:NextRequest){
 if(!await authorized())return NextResponse.json({error:'No autorizado'},{status:401});
 const client=db();if(!client)return NextResponse.json({error:'Sin DB'},{status:503});
 const raw=req.nextUrl.searchParams.get('days');
 const days=raw==='0'?0:Math.min(365,Math.max(1,Number(raw)||30));
 const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const since=days===0?new Date(today+'T03:00:00.000Z').toISOString():new Date(Date.now()-days*86400000).toISOString();
 const rows:Row[]=[];
 for(let i=0;i<100;i++){
  const {data,error}=await client.from('web_interactions').select('action,detail,session_id,created_at,id').gte('created_at',since).order('created_at',{ascending:false}).order('id',{ascending:false}).range(i*500,i*500+499);
  if(error)return NextResponse.json({error:error.message},{status:500});
  rows.push(...(data||[]));if(!data||data.length<500)break;
 }
 const {data:products,error:productError}=await client.from('products').select('id,name,tiny_savory');
 if(productError)return NextResponse.json({error:productError.message},{status:500});
 const names=new Map((products||[]).map(p=>[String(p.id),String(p.name)]));
 const savory=new Map((products||[]).map(p=>[String(p.name),Boolean(p.tiny_savory)]));
 const apps:Record<string,string>={pedidosya:'PedidosYa',ubereats:'Uber Eats',mercadolibre:'Mercado Libre',mercadolibredelivery:'Mercado Libre',rappi:'Rappi'};
 const groups=new Map<string,{action:string;detail:string;clicks:number;visitors:Set<string>}>();
 const add=(action:string,detail:string,sid:string,n=1)=>{const key=JSON.stringify([action,detail]);if(!groups.has(key))groups.set(key,{action,detail,clicks:0,visitors:new Set()});const g=groups.get(key)!;g.clicks+=n;g.visitors.add(sid)};
 const unmatched=new Map<string,number[]>();
 let duplicates=0;
 for(const r of rows){
  if(r.action==='product_view')continue;
  let detail=r.detail;let d:any=null;
  if(detail.startsWith('{')){try{d=JSON.parse(detail);detail=String(d.name||d.category||detail)}catch{}}
  detail=names.get(detail)||detail;
  if(r.action==='delivery_app_click'){
   const original=detail;detail=apps[detail.toLowerCase().replace(/[^a-z]/g,'')]||detail;
   // Pair only opposite legacy labels in the same session within two seconds.
   const legacy=original!==detail;const key=JSON.stringify([r.session_id,detail,legacy]);const opposite=JSON.stringify([r.session_id,detail,!legacy]);const t=Date.parse(r.created_at);const pending=unmatched.get(opposite)||[];const i=pending.findIndex(x=>Math.abs(x-t)<=2000);
   if(i>=0){pending.splice(i,1);duplicates++;continue;}
   const own=(unmatched.get(key)||[]).filter(x=>Math.abs(x-t)<=2000);own.push(t);unmatched.set(key,own);
  }
  if(r.action==='tiny_flavors_selected'&&Array.isArray(d?.flavors))for(const f of d.flavors){const n=Number(f.quantity??f.qty);if(typeof f.name==='string'&&Number.isInteger(n)&&n>0)add(savory.get(detail)?'tiny_savory_flavor':'tiny_sweet_flavor',f.name,r.session_id,n);}
  add(r.action,detail,r.session_id);
 }
 return NextResponse.json({duplicates,actions:[...groups.values()].map(g=>({action:g.action,detail:g.detail,clicks:g.clicks,visitors:g.visitors.size})).sort((a,b)=>b.clicks-a.clicks)});
}
