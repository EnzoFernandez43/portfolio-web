import { getProyectos } from '@/actions/proyectos';
import ProyectosSection from '@/components/proyectos/ProyectosSection';

export default async function ProyectosPage() {
    const proyectos = await getProyectos();
    return <ProyectosSection proyectos={proyectos} />;
}