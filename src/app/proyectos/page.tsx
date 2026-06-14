import { getProyectos } from '@/actions/proyectos';
import ProyectosSection from '@/components/proyectos/ProyectosSection';

export default async function ProyectosPage() {
    const proyectos = await getProyectos();
    return (
        <div className="relative z-0 min-h-screen">
            <img src="/fondoPantallaProyectos.png" alt="" className="hidden md:block absolute inset-0 w-full h-full object-cover pointer-events-none -z-10" />
            <img 
              src="/fondoPantallaProyectosMobile.png" 
              alt="" 
              className="md:hidden absolute inset-0 w-full h-full object-cover pointer-events-none -z-10" 
              style={{ objectPosition: '-200px center' }}
            />
            <ProyectosSection proyectos={proyectos} />
        </div>
    );
}
