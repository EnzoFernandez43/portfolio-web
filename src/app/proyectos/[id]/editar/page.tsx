import { getProyectoById } from '@/actions/proyectos';
import EditarProyectoForm from '@/components/proyectos/EditarProyectoForm';

export default async function EditarProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proyecto = await getProyectoById(id);

  if (!proyecto) {
    return <div className="text-white text-center pt-20">Proyecto no encontrado</div>;
  }

  return <EditarProyectoForm proyecto={proyecto} />;
}