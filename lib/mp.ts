import {db} from './server';
export async function refreshPayment(orderId:string){const client=db();const token=process.env.MP_ACCESS_TOKEN;if(!client||!token)return null;const {data:order}=await client.from('web_orders').select('*').eq('id',orderId).single();if(!order)return null;
 const response=await fetch(`https://api.mercadopago.com/v1/payments/search?external_reference=${encodeURIComponent(orderId)}&sort=date_created&criteria=desc&limit=10`,{headers:{Authorization:`Bearer ${token}`},cache:'no-store'});
 if(response.ok){const data=await response.json();const payments=Array.isArray(data.results)?data.results:[];const approved=payments.find((p:{status:string;transaction_amount:number;currency_id:string;external_reference:string})=>p.status==='approved'&&p.currency_id==='ARS'&&p.external_reference===orderId&&Math.abs(Number(p.transaction_amount)-Number(order.total))<0.01);if(approved){await client.from('web_orders').update({status:'approved',payment_id:String(approved.id)}).eq('id',orderId);return {...order,status:'approved',payment_id:String(approved.id)}}}
 return order;
}
