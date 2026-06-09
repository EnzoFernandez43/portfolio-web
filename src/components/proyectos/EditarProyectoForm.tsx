'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Proyecto, updateProyecto } from '@/actions/proyectos';

const TECNOLOGIAS = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'PostgreSQL', 'Express',
  'Firebase', 'Tailwind', 'Socket.io', 'HTML', 'CSS', 'JavaScript', 'Next.js',
  'Prisma', 'Docker', 'Java', 'Spring Boot', 'SQL'];

export default function EditarProyectoForm({ proyecto }: { proyecto: Proyecto }) {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: proyecto.titulo, subtitulo: proyecto.subtitulo, descripcion: proyecto.descripcion,
    imagen_url: proyecto.imagen_url, github_url: proyecto.github_url, demo_url: proyecto.demo_url,
    categoria: proyecto.categoria ?? [], tecnologias: proyecto.tecnologias ?? [],
    destacado: proyecto.destacado, orden: proyecto.orden,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const toggleArray = (key: 'tecnologias' | 'categoria', val: string) =>
    setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val] }));

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
      await updateProyecto(proyecto.id, form);
      router.push('/proyectos');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-[112px] pb-20 px-6 max-w-xl mx-auto">
        <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-7 w-full max-w-xl max-h-[90vh] overflow-y-auto mx-4"
            style={{ boxShadow: '0 0 60px rgba(255,92,0,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black">Editar proyecto</h2>
              <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">✕</button>
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
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </div>
    </section>
  );
}