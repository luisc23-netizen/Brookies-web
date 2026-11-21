import {NextRequest,NextResponse} from 'next/server';
import {db} from '../../../lib/server';
const actions=new Set(['delivery_app_click','map_open','google_maps','whatsapp_header','tiny_selector_open','tiny_box_added','product_view','checkout_view','category_open','product_add','product_remove','product_like','product_unlike','product_share','tiny_flavors_selected']);
export async function POST(req:NextRequest){
 try{
  const b=await req.json();
  const action=String(b.action||'');
  const detail=String(b.detail||'').slice(0,600);
  const session=String(b.session_id||'');
  if(!actions.has(action)||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session))return NextResponse.json({error:'Inválido'},{status:400});
  const client=db();if(!client)return NextResponse.json({ok:false},{status:503});
  const {error}=await client.from('web_interactions').insert({action,detail,session_id:session});
  return NextResponse.json({ok:!error,error:error?.message},{status:error?500:200});
 }catch{return NextResponse.json({ok:false},{status:400})}
}
