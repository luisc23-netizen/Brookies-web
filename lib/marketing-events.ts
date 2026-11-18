"use client";
/** Eventos ecommerce: Meta Pixel existente en GTM y GA4 via dataLayer.
 * No carga un segundo pixel; GTM debe escuchar eventos GA4 si se desea GA4 ecommerce.
 */
type Item={item_id:string;item_name:string;price:number;quantity:number};
type Payload={currency?:string;value?:number;content_ids?:string[];contents?:{id:string;quantity:number;item_price:number}[];content_type?:string;num_items?:number;eventID?:string};
declare global {interface Window {fbq?:((...args:unknown[])=>void);dataLayer?:Record<string,unknown>[]}}
export function productItem(p:{id:string;name:string;price:number},quantity=1):Item{return {item_id:String(p.id),item_name:p.name,price:Number(p.price)||0,quantity}}
export function emitCommerce(event:string,items:Item[],value?:number,metaEvent?:string,extra?:Record<string,unknown>){
 if(typeof window==='undefined')return;
 const total=value??items.reduce((n,i)=>n+i.price*i.quantity,0);
 window.dataLayer=window.dataLayer||[];
 window.dataLayer.push({ecommerce:null});
 window.dataLayer.push({event,ecommerce:{currency:'ARS',value:total,items},...extra});
 if(metaEvent&&typeof window.fbq==='function'){
  const data:Payload={currency:'ARS',value:total,content_type:'product',content_ids:items.map(i=>i.item_id),contents:items.map(i=>({id:i.item_id,quantity:i.quantity,item_price:i.price})),num_items:items.reduce((n,i)=>n+i.quantity,0)};
  window.fbq('track',metaEvent,data);
 }
}
export function emitLead(items:Item[]){emitCommerce('generate_lead',items,undefined,'Lead',{lead_type:'presupuesto_empresas'})}
