import { getProyectos } from '@/actions/proyectos';
import AdminPanel from '@/components/admin/AdminPanel';

export default async function AdminPage() {
    const proyectos = await getProyectos();
    return <AdminPanel proyectos={proyectos} />;
}