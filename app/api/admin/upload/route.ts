import {NextResponse} from 'next/server';
import {authorized,db} from '../../../../lib/server';
export const runtime='nodejs';
const types:Record<string,string>={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif'};
const bucket='brookies-media';
export async function POST(req:Request){
 if(!await authorized())return NextResponse.json({error:'No autorizado'},{status:401});
 const client=db();if(!client)return NextResponse.json({error:'Falta configurar Supabase'},{status:503});
 let file:File;try{const form=await req.formData();const input=form.get('file');if(!(input instanceof File))throw Error();file=input}catch{return NextResponse.json({error:'Seleccioná una imagen válida'},{status:400})}
 const ext=types[file.type];if(!ext)return NextResponse.json({error:'Formato no admitido. Usá PNG, JPG, WebP o GIF.'},{status:400});
 if(file.size>3*1024*1024)return NextResponse.json({error:'La imagen debe pesar menos de 3 MB'},{status:400});
 const bytes=new Uint8Array(await file.arrayBuffer());
 const valid=ext==='png'?bytes.length>8&&bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71:ext==='jpg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:ext==='gif'?String.fromCharCode(...bytes.slice(0,3))==='GIF':String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 if(!valid)return NextResponse.json({error:'El archivo no coincide con el formato de imagen'},{status:400});
 const {data:list,error:listError}=await client.storage.listBuckets();if(listError)return NextResponse.json({error:'Error de Storage: '+listError.message},{status:500});
 if(!list?.some(b=>b.name===bucket)){const {error}=await client.storage.createBucket(bucket,{public:true,fileSizeLimit:3145728,allowedMimeTypes:Object.keys(types)});if(error&&!/already exists|duplicate/i.test(error.message))return NextResponse.json({error:'No se pudo crear el bucket: '+error.message},{status:500})}
 const path=`logos/${crypto.randomUUID()}.${ext}`;const {error}=await client.storage.from(bucket).upload(path,bytes,{contentType:file.type,upsert:false,cacheControl:'3600'});
 if(error)return NextResponse.json({error:'No se pudo subir: '+error.message},{status:500});
 const {data}=client.storage.from(bucket).getPublicUrl(path);return NextResponse.json({url:data.publicUrl});
}
