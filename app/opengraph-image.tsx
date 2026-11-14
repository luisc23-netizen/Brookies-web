import {ImageResponse} from 'next/og';
import {siteSettings} from '../lib/server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const size={width:1200,height:630};
export const contentType='image/png';
export default async function Image(){
 const s=await siteSettings();
 const photo=s.social_share_image?.trim();
 if(photo&&/^https:\/\//.test(photo)){
  return new ImageResponse(<div style={{display:'flex',width:'100%',height:'100%',background:'#4b1023'}}><img src={photo} alt="Brookies" width={1200} height={630} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>,size);
 }
 return new ImageResponse(<div style={{display:'flex',width:'100%',height:'100%',background:'#4b1023',color:'#f6eee5',alignItems:'center',justifyContent:'center',flexDirection:'column'}}><div style={{fontSize:100,fontWeight:800}}>BROOKIES</div><div style={{fontSize:36}}>Casa de galletitas · Rosario</div></div>,size);
}
