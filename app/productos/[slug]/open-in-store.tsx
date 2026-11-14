'use client';
import {useEffect} from 'react';
export default function OpenInStore({section,slug}:{section:string;slug:string}){
 useEffect(()=>{const target=`/${section}?producto=${encodeURIComponent(slug)}`;window.location.replace(target)},[section,slug]);
 return null;
}
