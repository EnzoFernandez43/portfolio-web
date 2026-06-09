import { getProyectoById } from '@/actions/proyectos';
import EditarProyectoForm from '@/components/proyectos/EditarProyectoForm';

export default async function EditarProyectoPage({ params }: { params: { id: string } }) {
  const proyecto = await getProyectoById(params.id);

  if (!proyecto) {
    return <div className="text-white text-center pt-20">Proyecto no encontrado</div>;
  }

  return <EditarProyectoForm proyecto={proyecto} />;
}