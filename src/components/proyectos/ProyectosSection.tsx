'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import ProyectoCard from './ProyectoCard';
import { Proyecto, createProyecto, updateProyecto, deleteProyecto } from '@/actions/proyectos';
import { getTechIcon } from '@/lib/techIcons';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const CATEGORIAS = ['Todos', 'Web Apps', 'APIs', 'Full-Stack', 'Frontend', 'Backend'];
const TECNOLOGIAS = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'PostgreSQL', 'Express',
  'Firebase', 'Tailwind', 'Socket.io', 'HTML', 'CSS', 'JavaScript', 'Next.js',
  'Prisma', 'Docker', 'Java', 'Spring Boot', 'SQL'];

const EMPTY_FORM = {
  titulo: '', subtitulo: '', descripcion: '', imagen_url: '',
  github_url: '', demo_url: '', categoria: [] as string[],
  tecnologias: [] as string[], destacado: false, orden: 0,
};

export default function ProyectosSection({ proyectos: initial }: { proyectos: Proyecto[] }) {
  const [filtro, setFiltro] = useState('Todos');
  const [proyectos, setProyectos] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { isAdmin } = useAuth();
  const router = useRouter();

  const filtrados = filtro === 'Todos' ? proyectos : proyectos.filter(p => p.categoria?.includes(filtro));

  const toggleArray = (key: 'tecnologias' | 'categoria', val: string) =>
    setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val] }));

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (p: Proyecto) => {
    setForm({
      titulo: p.titulo, subtitulo: p.subtitulo, descripcion: p.descripcion,
      imagen_url: p.imagen_url, github_url: p.github_url, demo_url: p.demo_url,
      categoria: p.categoria ?? [], tecnologias: p.tecnologias ?? [],
      destacado: p.destacado, orden: p.orden,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: data });
    const json = await res.json();
    setForm(f => ({ ...f, imagen_url: json.secure_url }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateProyecto(editingId, form);
        setProyectos(prev => prev.map(p => p.id === editingId ? { ...p, ...form } : p));
      } else {
        await createProyecto(form);
        router.refresh();
      }
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminás este proyecto?')) return;
    await deleteProyecto(id);
    setProyectos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <section className="pt-10 pb-20 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
        <div>
          <h2 className="text-5xl font-black text-white uppercase" style={{ fontFamily: 'var(--font-bebas)' }}>
            MIS <span className="text-[#FF5C00]">PROYECTOS</span>
          </h2>
          <div className="w-16 h-1 bg-[#FF5C00] mt-3" />
          <p className="text-gray-400 mt-3 max-w-md" style={{ fontFamily: 'var(--font-barlow)' }}>
            Una selección de proyectos en los que he trabajado, solucionando problemas reales con código y creatividad.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setFiltro(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${filtro === cat ? 'bg-transparent border-[#FF5C00] text-white' : 'border-[#2a2b33] text-gray-400 hover:border-gray-500'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {filtrados.map((p) => (
          <ProyectoCard
            key={p.id}
            id={p.id}
            title={p.titulo}
            subtitle={p.subtitulo}
            description={p.descripcion}
            image={p.imagen_url}
            techIcons={p.tecnologias?.map(t => getTechIcon(t))}
            githubLink={p.github_url}
            projectLink={p.demo_url}
            highlight={p.destacado}
            onEdit={() => openEdit(p)}
            onDelete={() => handleDelete(p.id)}
          />
        ))}

        {/* Card agregar — solo en modo admin */}
        {isAdmin && (
          <button onClick={openCreate}
            className="h-full min-h-[280px] flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#FF5C00]/50 hover:bg-[#FF5C00]/5 transition-all group">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 group-hover:border-[#FF5C00]/60 flex items-center justify-center transition-all">
              <Plus size={22} className="text-white/30 group-hover:text-[#FF5C00] transition-colors" />
            </div>
            <span className="text-white/30 group-hover:text-[#FF5C00] text-sm font-medium transition-colors">Agregar proyecto</span>
          </button>
        )}
      </div>

      {/* CTA */}
      <div className="mt-16 border border-[#1f2026] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0c0d11]/60">
        <div className="flex items-center gap-4">
          <span className="text-[#FF5C00] text-3xl font-black">{`</>`}</span>
          <div>
            <p className="text-white font-bold text-lg">¿Tienes una idea o proyecto en mente?</p>
            <p className="text-gray-400 text-sm">Estoy disponible para nuevos desafíos y colaboraciones.</p>
          </div>
        </div>
        <a href="/contacto" className="bg-[#FF5C00] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all shrink-0">
          Hablemos →
        </a>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-7 w-full max-w-xl max-h-[90vh] overflow-y-auto mx-4"
            style={{ boxShadow: '0 0 60px rgba(255,92,0,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black">{editingId ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>
            <div className="h-px bg-gradient-to-r from-[#FF5C00] via-[#FF5C00]/40 to-transparent mb-6" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {([['titulo', 'Título *', true], ['subtitulo', 'Subtítulo', false], ['github_url', 'GitHub URL', false], ['demo_url', 'Demo URL', false]] as [keyof typeof form, string, boolean][]).map(([key, label, req]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">{label}</label>
                  <input type="text" value={form[key] as string} required={req}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#FF5C00]/60 transition-all" />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">Descripción</label>
                <textarea value={form.descripcion} rows={3}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#FF5C00]/60 transition-all resize-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">Imagen</label>
                <div className="flex gap-2 items-center">
                  <label className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-pointer hover:border-[#FF5C00]/40 transition-all">
                    {uploading ? 'Subiendo...' : form.imagen_url ? 'Cambiar imagen' : 'Subir imagen'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {form.imagen_url && <img src={form.imagen_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">Categorías</label>
                <div className="flex flex-wrap gap-2">
                  {['Web Apps', 'APIs', 'Full-Stack', 'Frontend', 'Backend'].map(cat => (
                    <button type="button" key={cat} onClick={() => toggleArray('categoria', cat)}
                      className={`px-3 py-1 rounded-full text-xs border transition-all ${form.categoria.includes(cat) ? 'border-[#FF5C00] text-white bg-[#FF5C00]/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">Tecnologías</label>
                <div className="flex flex-wrap gap-2">
                  {TECNOLOGIAS.map(tech => (
                    <button type="button" key={tech} onClick={() => toggleArray('tecnologias', tech)}
                      className={`px-3 py-1 rounded-full text-xs border transition-all ${form.tecnologias.includes(tech) ? 'border-[#FF5C00] text-white bg-[#FF5C00]/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.destacado}
                  onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))}
                  className="accent-[#FF5C00]" />
                <span className="text-gray-400 text-sm">Destacado</span>
              </label>

              <button type="submit" disabled={loading || uploading}
                className="mt-2 bg-[#FF5C00] hover:bg-[#e05200] disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                {loading ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear proyecto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}