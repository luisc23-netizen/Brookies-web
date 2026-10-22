import {createClient} from '@supabase/supabase-js';
import {cookies} from 'next/headers';
import {createHmac,timingSafeEqual} from 'crypto';
import {demo,Product} from './data';
export function db(){const u=process.env.SUPABASE_URL,k=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!u||!k)return null;return createClient(u,k,{auth:{persistSession:false}})}
export async function catalog():Promise<Product[]>{const client=db();if(!client)return demo;const {data,error}=await client.from('products').select('*').eq('active',true).order('sort_order');if(error){console.error(error.message);return []}return data as Product[]}
function sign(s:string){return createHmac('sha256',process.env.SESSION_SECRET||'').update(s).digest('hex')}
export function secureEqual(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
export function sessionValue(){const v='brookies-admin';return v+'.'+sign(v)}
export async function authorized(){if(!process.env.SESSION_SECRET||!process.env.ADMIN_PASSWORD)return false;const c=(await cookies()).get('brookies_session')?.value||'';return secureEqual(c,sessionValue())}

export async function siteSettings():Promise<Record<string,string>>{const client=db();if(!client)return {};const {data,error}=await client.from('site_settings').select('key,value');if(error){console.error(error.message);return {}}return Object.fromEntries((data||[]).map((x:{key:string;value:string})=>[x.key,x.value]))}
