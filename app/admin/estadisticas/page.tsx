import {authorized} from '../../../lib/server';
import Stats from './stats';
export const dynamic='force-dynamic';
export default async function Page(){if(!await authorized())return <main style={{padding:40}}><h1>Acceso restringido</h1><a href="/admin">Ingresá al administrador</a></main>;return <Stats/>}
