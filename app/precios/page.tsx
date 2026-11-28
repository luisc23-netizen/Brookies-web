import {catalog,db} from '../../lib/server';
import {promotionalPrice,isRosarioTuesday} from '../../lib/box-pricing';
import type {Product} from '../../lib/data';
export const dynamic='force-dynamic';
export const metadata={title:'Precios | Brookies'};
const money=(n:number)=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
export default async function Page(){
 const groups=new Map<string,Product[]>();let error=false;let products:Product[]=[];
 try{if(!db())throw Error('Sin catálogo');products=await catalog();}catch{error=true;}
 for(const p of products){if(!p.active)continue;const category=p.category||'Otros';const list=groups.get(category)||[];list.push(p);groups.set(category,list);}
 return <main style={{maxWidth:720,margin:'auto',padding:'32px 20px',background:'#f8f2e8',color:'#571b2c',minHeight:'100vh'}}><a href="/">← Volver a Brookies</a><h1 style={{fontSize:38,marginBottom:4}}>BROOKIES</h1><h2>Lista de precios</h2><p>Casa de galletitas · Rosario</p>{error?<p>El catálogo no está disponible. Intentá nuevamente.</p>:Array.from(groups,([category,list])=><section key={category} style={{marginTop:28}}><h2 style={{borderBottom:'2px solid #571b2c',paddingBottom:8}}>{category}</h2>{list.map(p=>{const price=promotionalPrice(p,products,isRosarioTuesday());return <div key={p.id} style={{display:'flex',justifyContent:'space-between',gap:16,padding:'12px 0',borderBottom:'1px solid #d8c8bd'}}><span>{p.name}</span><strong style={{whiteSpace:'nowrap'}}>{price>0?money(price):'Consultar'}</strong></div>})}</section>)}<p style={{marginTop:30}}>Precios de la tienda web. Envío no incluido.</p></main>;
}
