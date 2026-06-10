import NuevoProyectoForm from '@/components/proyectos/NuevoProyectoForm';
import { Proyecto } from '@/actions/proyectos';

export default function EditarProyectoForm({ proyecto }: { proyecto: Proyecto & { imagenes_muestra?: string[] } }) {
  return <NuevoProyectoForm proyecto={proyecto} />;
}