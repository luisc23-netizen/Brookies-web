"use client";
import {useEffect} from 'react';
import {emitCommerce} from '../../../lib/marketing-events';
export default function PurchaseTracker({orderId,total,items}:{orderId:string;total:number;items:{item_id:string;item_name:string;price:number;quantity:number}[]}){
 useEffect(()=>{const key='brookies_purchase_'+orderId;try{if(localStorage.getItem(key))return;localStorage.setItem(key,'1')}catch{return}emitCommerce('purchase',items,total,'Purchase',{transaction_id:orderId})},[orderId,total,items]);
 return null;
}
