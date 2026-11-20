'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {emitCommerce,emitLead,productItem} from '../lib/marketing-events';
import type {Product} from '../lib/data';
import {calculateBoxes,bundleOptions,isRosarioTuesday,cookieFlavor,isGoBig,normalize} from '../lib/box-pricing';
import {getAttribution} from './attribution-client';
import {Plus,Minus,ArrowRight,X,ChevronDown,Trash2,MapPin,Heart} from 'lucide-react';
const money=(n:number)=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
type Entry={id:string;qty:number};
const sections=['cookies','royal','celebraciones','empresas','pequenos-detalles'] as const;
type Section=typeof sections[number];
export default function Store({products,settings,initialSection='cookies',initialProduct}:{products:Product[];settings:Record<string,string>;initialSection?:string;initialProduct?:string}){
 const [isTuesday,setIsTuesday]=useState(false);
 useEffect(()=>{const update=()=>setIsTuesday(isRosarioTuesday());update();const interval=window.setInterval(update,15000);return ()=>window.clearInterval(interval)},[]);
 const [shareHint,setShareHint]=useState<string|null>(null);
 const [likedIds,setLikedIds]=useState<string[]>([]);
 useEffect(()=>{try{const saved=JSON.parse(window.localStorage.getItem('brookies-liked-products')||'[]');if(Array.isArray(saved))setLikedIds(saved.filter((id):id is string=>typeof id==='string'))}catch{}},[]);
 const toggleLike=(id:string)=>setLikedIds(old=>{const next=old.includes(id)?old.filter(x=>x!==id):[...old,id];try{window.localStorage.setItem('brookies-liked-products',JSON.stringify(next))}catch{}return next});
 const [hasAdded,setHasAdded]=useState(false),[showLocation,setShowLocation]=useState(false);
 const [latestAdded,setLatestAdded]=useState<string|null>(null),[showSelection,setShowSelection]=useState(false);
 const [section,setSection]=useState<string>(initialSection||'cookies');
 const [selection,setSelection]=useState<Entry[]>([]),[extras,setExtras]=useState<Entry[]>([]),[businessSelection,setBusinessSelection]=useState<Entry[]>([]),[step,setStep]=useState<'feed'|'extras'|'checkout'>('feed');
 const [index,setIndex]=useState(0),[delivery,setDelivery]=useState('Retiro por el local'),[address,setAddress]=useState(''),[customerName,setCustomerName]=useState(''),[note,setNote]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const scrollRef=useRef<HTMLDivElement>(null);
 const wrapGuard=useRef(false);
 const introPlayed=useRef(false);
 const wrapTimer=useRef<number|null>(null);
 const active=products.filter(p=>p.active!==false);const flavors=active.filter(p=>cookieFlavor(p)&&!isGoBig(p));
 const royals=active.filter(p=>/royal/.test(normalize(p.category)));const details=active.filter(p=>/pequenos detalles|pequeno detalle/.test(normalize(p.category)));
 const celebrations=active.filter(p=>/celebracion/.test(normalize(p.category))||p.gift_eligible===true);
 const businesses=active.filter(p=>/empresa/.test(normalize(p.category)));
 const categoryDefs:{name:string;sort_order:number;active:boolean;highlight?:boolean;bg_color?:string;border_color?:string;glow_color?:string;glow_strength?:number}[]=(()=>{try{const v=JSON.parse(settings.catalog_categories||'[]');return Array.isArray(v)?v:[]}catch{return []}})();
 const slugCategory=(name:string)=>normalize(name).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 // Las secciones históricas conservan su identidad. Las categorías creadas en el admin
 // se añaden únicamente cuando son nuevas, sin inferir pestañas de cada producto.
 type CategoryTab={id:string;name:string;sort_order?:number;active?:boolean;highlight?:boolean;bg_color?:string;border_color?:string;glow_color?:string;glow_strength?:number};
 const canonicalId=(name:string)=>{const id=slugCategory(name);if(['cookies','cookie','coleccion-de-cookies','coleccion-de-cookie'].includes(id))return 'cookies';if(['celebracion','celebraciones'].includes(id))return 'celebraciones';if(['royal','royals'].includes(id))return 'royal';if(['empresa','empresas'].includes(id))return 'empresas';if(['pequeno-detalle','pequenos-detalles'].includes(id))return 'pequenos-detalles';return id};
 const builtInTabs:CategoryTab[]=[{id:'cookies',name:'Cookies'},{id:'celebraciones',name:'Celebraciones'},{id:'royal',name:'Royal'},{id:'empresas',name:'Empresas'},{id:'pequenos-detalles',name:'Pequeños detalles'}];
 const tabs:CategoryTab[]=[...builtInTabs.map(t=>({...t,...(categoryDefs.find(c=>canonicalId(c.name)===t.id)||{}),id:t.id,name:t.name})),...categoryDefs.filter(c=>c.active&& !builtInTabs.some(t=>t.id===canonicalId(c.name))).sort((a,b)=>a.sort_order-b.sort_order).map(c=>({id:canonicalId(c.name),...c}))].filter((c,i,a)=>a.findIndex(x=>x.id===c.id)===i);
 const category=categoryDefs.find(c=>canonicalId(c.name)===section);
 const shown=section==='cookies'?flavors:section==='royal'?royals:section==='celebraciones'?celebrations:section==='pequenos-detalles'?details:section==='empresas'?businesses:active.filter(p=>canonicalId(p.category)===section);
 const tabName=tabs.find(t=>t.id===section)?.name||section;
 const tabStyle=(c:{highlight?:boolean;bg_color?:string;border_color?:string;glow_color?:string;glow_strength?:number}):React.CSSProperties=>c.highlight?{background:c.bg_color||'#57152a',borderColor:c.border_color||'#ffe2a4',borderStyle:'solid',borderWidth:1,color:'#fff5e9',boxShadow:`0 0 ${Math.round((c.glow_strength??60)/5)}px ${c.glow_color||'#ffd78b'}`}:{ };
 const viewedRef=useRef('');
 useEffect(()=>{if(step!=='feed')return;const p=shown[index];if(!p)return;const key=section+':'+p.id;if(viewedRef.current===key)return;viewedRef.current=key;emitCommerce('view_item',[productItem(p)],p.price,'ViewContent')},[section,index,step,shown]);
 const boxes=useMemo(()=>calculateBoxes(active,selection,isTuesday),[active,selection,isTuesday]);
 const extrasTotal=extras.reduce((sum,e)=>sum+(active.find(p=>p.id===e.id)?.price||0)*e.qty,0);
 const total=boxes.total+extrasTotal;const count=boxes.quantity+extras.reduce((n,e)=>n+e.qty,0);
 const deliveryFee=Number(settings.rosario_delivery_fee??4000);
 const fee=delivery==='Envío dentro de Rosario'?deliveryFee:0;
 const orderLines=[...boxes.lines,...extras.map(e=>({id:e.id,qty:e.qty,flavors:[]}))];
 const change=(id:string,delta:number,royal=false)=>{if(delta>0){const p=active.find(x=>x.id===id);if(p)emitCommerce('add_to_cart',[productItem(p,delta)],p.price*delta,'AddToCart')}if(delta>0)setHasAdded(true);if(delta>0&&!royal)setLatestAdded(id);else if(delta<0&&!royal)setLatestAdded(null);const setter=section==='empresas'&&step==='feed'?setBusinessSelection:royal?setExtras:setSelection;setter(old=>{const found=old.find(x=>x.id===id);if(!found&&delta<0)return old;if(!found)return [...old,{id,qty:1}];return old.map(x=>x.id===id?{...x,qty:x.qty+delta}:x).filter(x=>x.qty>0)});};
 useEffect(()=>{if(!latestAdded)return;const timer=window.setTimeout(()=>setLatestAdded(null),650);return ()=>window.clearTimeout(timer)},[latestAdded,selection]);
 const selectedUnits=selection.flatMap(e=>Array.from({length:e.qty},()=>({id:e.id,name:active.find(p=>p.id===e.id)?.name||'Cookie'})));
 const qty=(id:string,royal=false)=>(section==='empresas'&&step==='feed'?businessSelection:royal?extras:selection).find(e=>e.id===id)?.qty||0;
 function go(s:string){setSection(s);setStep('feed');setIndex(0);window.history.replaceState(null,'','/'+s+window.location.search.replace(/([?&])producto=[^&]*/,'$1').replace(/[?&]$/,''));}
 // Tres copias del catálogo permiten pasar del último al primero y viceversa
 // solamente cuando el cliente desliza, sin salto automático en el último.
 useEffect(()=>{
  if(step!=='feed'||!shown.length)return;
  const el=scrollRef.current;if(!el)return;
  wrapGuard.current=true;
  const first=initialProduct&&section===initialSection?Math.max(0,shown.findIndex(p=>p.slug===initialProduct)):0;
  el.scrollTop=(shown.length+first)*el.clientHeight;
  setIndex(first);
  requestAnimationFrame(()=>{wrapGuard.current=false});
  if(!introPlayed.current&&shown.length>1&&!initialProduct){
   introPlayed.current=true;
   const startTimer=window.setTimeout(()=>{
    if(scrollRef.current!==el||wrapGuard.current)return;
    const base=el.scrollTop;
    const previousSnap=el.style.scrollSnapType;
    const previousBehavior=el.style.scrollBehavior;
    // Desactivar snap durante el gesto de bienvenida: de otro modo
    // el navegador devuelve la foto al inicio antes de mostrar el avance.
    wrapGuard.current=true;
    el.style.scrollSnapType='none';
    el.style.scrollBehavior='auto';
    const offset=Math.min(135,Math.max(70,el.clientHeight*.17));
    const duration=2400;
    const start=performance.now();
    let frame=0;
    const ease=(x:number)=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
    const animate=(now:number)=>{
     if(scrollRef.current!==el)return;
     const t=Math.min(1,(now-start)/duration);
     // Avanza y vuelve; alcanza a revelar la foto siguiente.
     const cycle=(t*2)%1;
     const progress=t>=1?0:cycle<.5?ease(cycle*2):ease((1-cycle)*2);
     el.scrollTop=base+offset*progress;
     if(t<1){frame=requestAnimationFrame(animate)}
     else{
      el.scrollTop=base;
      el.style.scrollSnapType=previousSnap;
      el.style.scrollBehavior=previousBehavior;
      wrapGuard.current=false;
     }
    };
    frame=requestAnimationFrame(animate);
   },950);
   return ()=>window.clearTimeout(startTimer);
  }
 },[section,step,shown.length,initialProduct]);
 const onReelScroll=()=>{
  const el=scrollRef.current;const n=shown.length;if(!el||n<2||wrapGuard.current)return;
  const h=el.clientHeight;if(!h)return;
  const page=Math.round(el.scrollTop/h);
  setIndex(((page%n)+n)%n);
  if(wrapTimer.current)window.clearTimeout(wrapTimer.current);
  wrapTimer.current=window.setTimeout(()=>{
   if(!scrollRef.current||wrapGuard.current)return;
   const current=Math.round(el.scrollTop/h);
   // Recentrar únicamente tras finalizar el gesto, no al mostrar el último.
   if(current<n||current>=2*n){
    wrapGuard.current=true;
    const normalized=((current%n)+n)%n;
    const oldSnap=el.style.scrollSnapType;
    el.style.scrollSnapType='none';
    el.scrollTop=(n+normalized)*h;
    requestAnimationFrame(()=>{el.style.scrollSnapType=oldSnap;wrapGuard.current=false});
   }
  },170);
 };
 const viewOrder=()=>{
  if(step==='feed'&&count>0){
   emitCommerce('begin_checkout',[...selection,...extras].flatMap(e=>{const p=active.find(p=>p.id===e.id);return p?[productItem(p,e.qty)]:[]}),total,'InitiateCheckout');
   void fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'checkout_started',items:[...selection,...extras],total,attribution:getAttribution()})}).catch(()=>{});
  }
  setStep(step==='feed'?'extras':'checkout');
 };
 const phone=(settings.whatsapp||process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'5493412477553').replace(/\D/g,'');
 const payload=()=>({items:orderLines,delivery,address:address.trim(),customer_name:customerName.trim(),note:note.trim(),attribution:getAttribution()});
 const valid=()=>{if(!count){setError('Elegí al menos un producto.');return false}if(!customerName.trim()){setError('Ingresá tu nombre.');return false}if(delivery!=='Retiro por el local'&&!address.trim()){setError('Ingresá la dirección y localidad.');return false}setError('');return true};
 async function pay(){if(!valid())return;setBusy(true);try{const r=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload())});const data=await r.json();if(!r.ok||!data.url)throw Error(data.error||'No se pudo iniciar el pago');emitCommerce('add_payment_info',[...selection,...extras].flatMap(e=>{const p=active.find(p=>p.id===e.id);return p?[productItem(p,e.qty)]:[]}),total+fee,'AddPaymentInfo');window.location.assign(data.url)}catch(e){setError(e instanceof Error?e.message:'Error de pago');setBusy(false)}}
 async function whatsapp(){if(!valid())return;const popup=window.open('','_blank');setBusy(true);try{const key=crypto.randomUUID();const r=await fetch('/api/whatsapp-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload(),idempotency_key:key})});const data=await r.json();if(!r.ok||!data.ok)throw Error(data.error||'No se pudo registrar el pedido');emitCommerce('contact',[...selection,...extras].flatMap(e=>{const p=active.find(p=>p.id===e.id);return p?[productItem(p,e.qty)]:[]}),total, 'Contact',{contact_type:'pedido_whatsapp'});const desc=[...selection,...extras].map(e=>`${e.qty} × ${active.find(p=>p.id===e.id)?.name||'Cookie'}`).join('\n');const msg=`Hola Brookies, quiero enviar mi pedido.\nNombre: ${customerName}\n${desc}\nProductos: ${money(total)}\nEnvío: ${delivery==='Retiro por el local'?'Sin cargo (retiro en el local)':delivery==='Otras zonas (a consultar)'?'A cotizar':money(Number(data.total)-total)}\n${delivery==='Otras zonas (a consultar)'?'Total parcial (sin envío)':'TOTAL CON ENVÍO'}: ${money(Number(data.total))}\nEstado del pago: PENDIENTE DE PAGO (pedido enviado por WhatsApp, no pagado por Mercado Pago)\nModalidad: ${delivery}${address?'\nDirección: '+address:''}\n${note?'\nObservaciones: '+note:''}\nPedido web: ${data.id}`;const url=`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;if(popup&&!popup.closed)popup.location.href=url;else window.location.href=url}catch(e){popup?.close();setError(e instanceof Error?e.message:'Error de pedido')}finally{setBusy(false)}}
 const businessSelected=businessSelection.filter(e=>businesses.some(p=>p.id===e.id));
 const businessQuote=()=>{emitLead(businessSelected.flatMap(e=>{const p=businesses.find(x=>x.id===e.id);return p?[productItem(p,e.qty)]:[]}));const lines=businessSelected.map(e=>{const p=businesses.find(x=>x.id===e.id)!;return `${e.qty} × ${p.name} — ${money(p.price*e.qty)}`});
 const msg=lines.length?`Hola Brookies, quiero pedir un presupuesto para empresas por estos productos:\n${lines.join('\n')}\n\n¿Podemos conversar cantidades, personalización y entrega?`:'Hola Brookies, quiero consultar un presupuesto para regalos empresariales. ¿Me cuentan las opciones de personalización y cantidades?';
 window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer');};
 const shareProduct=async(p:Product)=>{const url=new URL(`/productos/${encodeURIComponent(p.slug)}`,window.location.origin).toString();const data={title:`${p.name} | Brookies`,text:p.description||`Mirá ${p.name} en Brookies`,url};try{if(navigator.share){await navigator.share(data);return;}if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);setShareHint(p.id);window.setTimeout(()=>setShareHint(null),1800);return;}window.prompt('Copiá el enlace del producto',url)}catch(e){if(e instanceof Error&&e.name==='AbortError')return;window.prompt('Copiá el enlace del producto',url)}};

 const productCard=(p:Product,i:number,embedded=false)=><article className={(section==='cookies'?'brk-cookie-layout ':'brk-other-layout ')+(embedded?'brk-mini-card':'brk-reel')} key={p.id} data-index={i}>
 <div className="brk-reel-photo">{(p.image||p.images?.[0])?<img src={p.image||p.images?.[0]} alt={p.name} loading={i<2?'eager':'lazy'}/>:<div className="brk-photo-fallback">BROOKIES</div>}</div>
 <div className="brk-reel-shade"/><div className="brk-reel-content"><div className="brk-product-label">{tabName||'Brookies'}</div><h1>{p.name} <span className="brk-inline-price">{money(p.price)}</span></h1><p>{p.description}</p><div className="brk-float-controls"><button type="button" className={`brk-float-like ${likedIds.includes(p.id)?'is-liked':''}`} aria-label={`${likedIds.includes(p.id)?'Quitar me gusta de':'Me gusta'} ${p.name}`} aria-pressed={likedIds.includes(p.id)} title="Me gusta" onClick={()=>toggleLike(p.id)}><Heart size={27} fill={likedIds.includes(p.id)?'currentColor':'none'} strokeWidth={2}/></button><button type="button" className="brk-float-share" aria-label={`Compartir ${p.name}`} title={`Compartir ${p.name}`} onClick={()=>shareProduct(p)}><svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 4l8 7-8 7v-4.5C6.4 13.5 3.4 16.2 2 20c-.2-7.3 3.4-12.4 11-12.6V4z"/></svg>{shareHint===p.id&&<span className="brk-share-feedback">¡Copiado!</span>}</button><button className="brk-float-plus" aria-label={`Agregar ${p.name}`} onClick={()=>change(p.id,1,section!=='cookies')}><Plus size={25}/><span className="brk-add-label">AGREGAR</span></button>{qty(p.id,section!=='cookies')>0&&<button className="brk-float-minus" aria-label={`Quitar una unidad de ${p.name}`} onClick={()=>change(p.id,-1,section!=='cookies')}><Minus size={19}/><span>{qty(p.id,section!=='cookies')}</span></button>}</div></div>
 </article>;
 return <div className="brk-app"><header className={`brk-top ${step!=='feed'?'brk-top-cart':''}`} ><a href="/cookies" onClick={e=>{e.preventDefault();go('cookies')}}>{settings.logo_image?<img src={settings.logo_image} alt="Brookies"/>:<span>BROOKIES</span>}</a><button type="button" className="brk-location-toggle" aria-label="Dónde estamos" aria-expanded={showLocation} onClick={()=>setShowLocation(v=>!v)}><MapPin size={22}/></button><a className="brk-header-contact" onClick={()=>emitCommerce("contact",[],0,"Contact",{contact_type:"whatsapp_header"})} href={`https://wa.me/${phone}?text=${encodeURIComponent("Hola Brookies, tengo una consulta.")}`} target="_blank" rel="noreferrer" aria-label="Consultar por WhatsApp"><svg viewBox="0 0 32 32" width="25" height="25" aria-hidden="true"><path fill="currentColor" d="M16 2.5C8.6 2.5 2.6 8.3 2.6 15.5c0 2.6.7 5.1 2.1 7.2L2.6 30l7.5-2c1.8 1 3.8 1.5 5.9 1.5 7.4 0 13.4-5.8 13.4-13S23.4 2.5 16 2.5Zm0 24.6c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.4 1.2 1.2-4.2-.3-.4c-1.2-1.9-1.8-4.1-1.8-6.5 0-5.9 4.9-10.7 11-10.7s11 4.8 11 10.7-4.9 10.7-11 10.7Zm6.1-8.1c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-2.1-.8-3.4-2.9-3.5-3.1-.2-.3 0-.5.2-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.7 5.9 5.1.8.3 1.4.5 1.9.6.8.1 1.6.1 2.2-.1.7-.2 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4Z"/></svg></a>{showLocation&&<div className="brk-location-popover" role="dialog" aria-label="Dirección de Brookies"><strong>Brookies · Casa de galletitas</strong><span>Salta 1525, Rosario, Santa Fe</span><a href="https://www.google.com/maps/search/?api=1&query=Brookies%20Salta%201525%20Rosario" target="_blank" rel="noopener noreferrer">VER EN GOOGLE MAPS ↗</a></div>}</header>
 {step==='feed'&&<nav className="brk-tabs" aria-label="Categorías">{tabs.filter(t=>t.id!=='pequenos-detalles').map(t=><button key={t.id} className={`${section===t.id?'selected':''} ${'highlight' in t&&t.highlight?'brk-highlight-category':''}`} style={tabStyle(t)} onClick={()=>go(t.id)}>{t.name}</button>)}</nav>}
  {step==='feed'&&!hasAdded&&<div className="brk-author-message">Usted está a punto de disfrutar piezas de autor.<span className="brk-author-second">Tómese su tiempo, disfrute y si puede comparta.</span></div>}
 {step==='feed'&&section==='cookies'&&boxes.quantity>0&&<div className="brk-cookie-tools">{step==='feed'&&section==='cookies'&&<div className="brk-progress" aria-label="Cookies seleccionadas">{Array.from({length:(()=>{const n=boxes.quantity;const cap=n<=4?4:n<=6?6:Math.ceil(n/6)*6;return n>0&&n===cap?cap+2:cap})()},(_,i)=>{const chosen=selectedUnits[i];const animating=Boolean(chosen&&latestAdded===chosen.id&&i===selectedUnits.length-1);return chosen?<button key={i} type="button" className={`brk-slot filled ${animating?'brk-slot-pop':''}`} title={`Quitar una ${chosen.name}`} aria-label={`Quitar una cookie ${chosen.name} de tu caja`} onClick={()=>change(chosen.id,-1)}>{animating?'✓':<Trash2 size={18}/>}</button>:<span key={i} className="brk-slot" aria-label="Espacio libre">+</span>})}</div>}{step==='feed'&&section==='cookies'&&<button className="brk-edit-selection" type="button" onClick={()=>setShowSelection(v=>!v)} aria-expanded={showSelection}>{showSelection?'OCULTAR SELECCIÓN':'EDITAR MIS SABORES'} <ChevronDown size={14}/></button>}{step==='feed'&&section==='cookies'&&showSelection&&<div className="brk-selection-list">{selection.length?selection.map(e=><div key={e.id}><span>{active.find(p=>p.id===e.id)?.name||'Cookie'} <b>× {e.qty}</b></span><div><button aria-label="Quitar una" onClick={()=>change(e.id,-1)}><Minus size={15}/></button><button aria-label="Agregar una" onClick={()=>change(e.id,1)}><Plus size={15}/></button></div></div>):<p>Todavía no elegiste sabores.</p>}</div>}{step==='feed'&&section==='cookies'&&<div className="brk-bottom-summary"><span>{isTuesday?'HOY LA CUARTA VA POR NUESTRA CUENTA':boxes.quantity===3?'Una más y completás tu caja de 4.':boxes.quantity===5?'Una más y llegás a la caja de 6.':boxes.quantity===4||boxes.quantity===6?'¡Caja completa!':''}</span></div>}</div>}
 {step==='feed'&&<><div className="brk-reels" ref={scrollRef} onScroll={onReelScroll}>{(shown.length>1?[...shown,...shown,...shown]:shown).map((p,i)=><div className="brk-reel-wrap" key={`${p.id}-${i}`}>{productCard(p,i)}</div>)}{!shown.length&&<div className="brk-empty">{section==='empresas'?<><h1>Brookies para empresas</h1><p>Regalos que elevan tu marca. Personalizamos presentes para equipos, clientes y eventos.</p><button className="brk-business-quote" onClick={businessQuote}>PEDIR PRESUPUESTO <ArrowRight size={18}/></button></>:'Pronto vas a encontrar novedades de Brookies.'}</div>}</div></>}

 {step==='extras'&&<div className="brk-flow-page"><button className="brk-back" onClick={()=>setStep('feed')}>← VOLVER A LOS SABORES</button><h1>¿Algo más para tu pedido?</h1><p>Un toque Royal o un pequeño detalle. Podés saltear esta parte cuando quieras.</p><h2>Royal</h2><div className="brk-extra-grid">{royals.map(p=><div className="brk-extra" key={p.id}>{(p.image||p.images?.[0])&&<img src={p.image||p.images?.[0]} alt={p.name}/>}<strong>{p.name}</strong><small>{p.description}</small><span>{money(p.price)}</span><div><button onClick={()=>change(p.id,-1,true)} disabled={!qty(p.id,true)}>−</button><b>{qty(p.id,true)}</b><button onClick={()=>change(p.id,1,true)}>+</button></div></div>)}</div><h2>Pequeños detalles</h2><div className="brk-extra-grid">{details.map(p=><div className="brk-extra" key={p.id}>{(p.image||p.images?.[0])&&<img src={p.image||p.images?.[0]} alt={p.name}/>}<strong>{p.name}</strong><small>{p.description}</small><span>{money(p.price)}</span><div><button onClick={()=>change(p.id,-1,true)} disabled={!qty(p.id,true)}>−</button><b>{qty(p.id,true)}</b><button onClick={()=>change(p.id,1,true)}>+</button></div></div>)}</div></div>}
 {step==='checkout'&&<div className="brk-flow-page brk-checkout"><button className="brk-back" onClick={()=>setStep('extras')}>← SEGUIR ELIGIENDO</button><h1>Comprá ahora.</h1><p className="brk-lead">Coordinamos el retiro o envío después de tu compra.</p><div className="brk-order-list">{[...selection,...extras].map(e=>{const p=active.find(p=>p.id===e.id);return p?<div key={e.id}><span>{e.qty} × {p.name}</span><div><button onClick={()=>change(e.id,-1,!cookieFlavor(p))}>−</button><button onClick={()=>change(e.id,1,!cookieFlavor(p))}>+</button></div></div>:null})}</div><div className="brk-order-total"><span>Productos</span><strong>{money(total)}</strong></div><label>Nombre para el pedido *<input value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="¿A nombre de quién?" autoComplete="name"/></label><fieldset className="brk-delivery-choices"><legend>¿Cómo querés recibir tu pedido?</legend><div className="brk-delivery-buttons"><button type="button" className={delivery==='Retiro por el local'?'active':''} aria-pressed={delivery==='Retiro por el local'} onClick={()=>setDelivery('Retiro por el local')}>RETIRO EN EL LOCAL<small>Salta 1525, Rosario</small></button><button type="button" className={delivery!=='Retiro por el local'?'active':''} aria-pressed={delivery!=='Retiro por el local'} onClick={()=>setDelivery('Envío dentro de Rosario')}>ENVÍO<small>Desde {money(deliveryFee)}</small></button></div></fieldset>{delivery!=='Retiro por el local'&&<label>Zona de entrega<select value={delivery} onChange={e=>setDelivery(e.target.value)}><option value="Envío dentro de Rosario">Rosario · {money(deliveryFee)}</option><option value="Otras zonas (a consultar)">Otras zonas · precio a consultar</option></select></label>}{delivery!=='Retiro por el local'&&<label>Dirección y localidad *<input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Calle, número y localidad"/></label>}<label>Observaciones<textarea rows={2} value={note} onChange={e=>setNote(e.target.value)}/></label><div className="brk-order-total"><span>{delivery==='Otras zonas (a consultar)'?'Total de productos (sin envío)':'Total con envío'}</span><strong>{delivery==='Otras zonas (a consultar)'?money(total):money(total+fee)}</strong></div>{error&&<p role="alert" className="brk-error">{error}</p>}<button className="brk-pay" disabled={busy||!count} onClick={pay}>PAGAR CON MERCADO PAGO <ArrowRight/></button>{delivery==='Otras zonas (a consultar)'&&<p className="brk-shipping-note">El costo de envío se coordina y abona por separado después de la compra.</p>}<button className="brk-wa" disabled={busy||!count} onClick={whatsapp}>ENVIAR MI PEDIDO POR WHATSAPP <ArrowRight/></button><address className="brk-checkout-address">Brookies · Salta 1525, Rosario, Santa Fe</address></div>}
 {step!=='checkout'&&<div className={`brk-bottom ${step==='extras'?'brk-bottom-compact':''}`}>
 {step==='feed'&&section==='empresas'?<button className="brk-next brk-business-quote" onClick={businessQuote}><span>PEDIR PRESUPUESTO</span><ArrowRight size={18}/></button>:step==='feed'&&count===0?<p className="brk-cart-placeholder">{isTuesday?'MARTES 4×3 · ELEGÍ 4 COOKIES Y PAGÁ 3':'AGREGÁ LOS PRODUCTOS A TU PEDIDO'}</p>:<button className="brk-next" onClick={viewOrder}><span>{step==='feed'?'VER MI PEDIDO Y COMPRAR':'FINALIZAR MI COMPRA'}</span><strong>{money(total)}</strong><ArrowRight size={18}/></button>}</div>}
 </div>;
}
