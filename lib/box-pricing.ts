import type {Product} from './data';
export const normalize=(s:string)=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
export const cookieFlavor=(p:Product)=>normalize(p.category)==='coleccion de cookies'||normalize(p.category)==='cookies';
export const isGoBig=(p:Product)=>/\bgo\s*big\s*(2|4|6)\b/i.test(p.name)||/^go-big-(2|4|6)$/.test(p.slug||'');
export type Selection={id:string;qty:number};
export type OrderLine={id:string;qty:number;flavors:{id:string;name:string;qty:number}[]};
export function bundleOptions(products:Product[]){const flavors=products.filter(p=>p.active!==false&&cookieFlavor(p)&&!isGoBig(p));const unit=flavors[0];const packs=products.filter(p=>p.active!==false&&isGoBig(p)).map(p=>({p,size:Number(p.box_size)||Number((p.slug||p.name).match(/[246]/)?.[0]||0)})).filter(x=>[2,4,6].includes(x.size)&&Number(x.p.price)>0);return {unit,packs,flavors};}
export function calculateBoxes(products:Product[],selection:Selection[]){const {unit,packs,flavors}=bundleOptions(products);const flavorIds=new Set(flavors.map(f=>f.id));const chosen=selection.filter(s=>flavorIds.has(s.id)&&Number.isInteger(s.qty)&&s.qty>0);const n=chosen.reduce((s,x)=>s+x.qty,0);if(!n||!unit)return {lines:[] as OrderLine[],total:0,quantity:0,next:4};
 const options=[{p:unit,size:1},...packs];const dp=Array(n+1).fill(Infinity) as number[];const back=Array(n+1).fill(-1) as number[];dp[0]=0;
 for(let i=1;i<=n;i++)for(let j=0;j<options.length;j++){const {p,size}=options[j];if(i>=size&&dp[i-size]+Number(p.price)<=dp[i]){dp[i]=dp[i-size]+Number(p.price);back[i]=j;}}
 const units=chosen.flatMap(s=>Array(s.qty).fill(s.id) as string[]);let index=0,remaining=n;const lines:OrderLine[]=[];
 while(remaining>0){const opt=options[back[remaining]];if(!opt)throw Error('No hay precio válido para esta cantidad');const slice=units.slice(index,index+opt.size);index+=opt.size;remaining-=opt.size;const grouped=new Map<string,number>();for(const id of slice)grouped.set(id,(grouped.get(id)||0)+1);const fs=[...grouped].map(([id,qty])=>({id,name:flavors.find(f=>f.id===id)?.name||'',qty}));if(opt.size===1){lines.push({id:slice[0],qty:1,flavors:[]});}else{lines.push({id:opt.p.id,qty:1,flavors:fs});}}
 const merged:OrderLine[]=[];for(const l of lines){const key=l.id+'|'+l.flavors.map(f=>f.id+':'+f.qty).join(',');const old=merged.find(x=>x.id+'|'+x.flavors.map(f=>f.id+':'+f.qty).join(',')===key);if(old)old.qty++;else merged.push({...l});}
 const next=n<4?4:n<6?6:Math.ceil((n+1)/6)*6;return {lines:merged,total:dp[n],quantity:n,next};}
