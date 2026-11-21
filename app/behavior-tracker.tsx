'use client';
import {useEffect} from 'react';

// Observa acciones de la tienda sin cambiar el diseño ni el flujo de compra.
// Los eventos de apps/WhatsApp/Tiny confirmada ya los envía Store.
export default function BehaviorTracker(){
 useEffect(()=>{
  const send=(action:string,detail:string)=>{
   try{
    let session_id=sessionStorage.getItem('brookies_session');
    if(!session_id){session_id=crypto.randomUUID();sessionStorage.setItem('brookies_session',session_id)}
    void fetch('/api/interaction',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,detail:detail.slice(0,600),session_id}),keepalive:true}).catch(()=>{});
   }catch{}
  };
  const category=()=>document.querySelector<HTMLButtonElement>('.brk-tabs button.selected')?.textContent?.trim()||'';
  const product=(el:Element)=>{
   const card=el.closest('.brk-reel');
   return card?.querySelector('h1')?.childNodes[0]?.textContent?.trim()||'';
  };
  const onClick=(event:MouseEvent)=>{
   const t=event.target;
   if(!(t instanceof Element))return;
   const b=t.closest('button');
   if(!b)return;
   if(b.closest('.brk-tabs')){
    const name=b.textContent?.trim()||'';
    if(name)send('category_open',name);
    return;
   }
   const name=product(b);
   if(b.matches('.brk-float-like')&&name){
    send(b.getAttribute('aria-pressed')==='true'?'product_unlike':'product_like',JSON.stringify({name,category:category()}));return;
   }
   if(b.matches('.brk-float-share')&&name){send('product_share',JSON.stringify({name,category:category()}));return}
   if(b.matches('.brk-float-plus')&&name){
    // Tiny se registra cuando se confirma el selector, no al abrirlo.
    if(!b.getAttribute('aria-label')?.includes('Tiny')) {
     const isTinyDialog=!!document.querySelector('[aria-label="Elegir sabores Tiny"]');
     if(!isTinyDialog)send('product_add',JSON.stringify({name,category:category(),quantity:1}));
    }
    return;
   }
   if(b.matches('.brk-float-minus')&&name){send('product_remove',JSON.stringify({name,category:category(),quantity:1}));return}
   if(b.closest('.brk-selection-list,.brk-order-list,.brk-extra-grid')){
    const label=b.getAttribute('aria-label')||b.textContent||'';
    const row=b.closest('.brk-extra,.brk-order-list > div,.brk-selection-list > div');
    const item=row?.querySelector('strong,span')?.textContent?.trim()||'';
    if(label.includes('+')||label.includes('Agregar')||label==='+' )send('product_add',JSON.stringify({name:item,category:category(),quantity:1}));
    if(label.includes('−')||label.includes('Quitar')||label==='−')send('product_remove',JSON.stringify({name:item,category:category(),quantity:1}));
   }
  };
  // El selector Tiny confirma sabores al pulsar el botón de agregar.
  const onTiny=(event:MouseEvent)=>{
   const t=event.target;if(!(t instanceof Element))return;
   const b=t.closest('button');if(!b||!b.textContent?.includes('AGREGAR BOX TINY')||b.disabled)return;
   const modal=b.closest('[aria-label="Elegir sabores Tiny"]');
   if(!modal)return;
   const name=modal.querySelector('h2')?.textContent?.trim()||'Tiny';
   const flavors=[...modal.querySelectorAll('div')].filter(d=>d.style.borderBottom==='1px solid rgb(221, 221, 221)'||d.style.borderBottom==='1px solid #ddd').map(d=>({name:d.querySelector('span')?.textContent?.trim()||'',quantity:Number(d.querySelector('strong')?.textContent||0)})).filter(x=>x.name&&x.quantity>0);
   send('tiny_flavors_selected',JSON.stringify({name,flavors}));
   send('product_add',JSON.stringify({name,category:category(),quantity:1,tiny:true}));
  };
  document.addEventListener('click',onClick,true);
  document.addEventListener('click',onTiny,true);
  return ()=>{document.removeEventListener('click',onClick,true);document.removeEventListener('click',onTiny,true)};
 },[]);
 return null;
}
