'use client';

import { useState } from 'react';
import { Proyecto, createProyecto, updateProyecto, deleteProyecto } from '@/actions/proyectos';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, LogOut, X, Upload } from 'lucide-react';

const TECNOLOGIAS = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'PostgreSQL', 'Express',
    'Firebase', 'Tailwind', 'Socket.io', 'HTML', 'CSS', 'JavaScript', 'Next.js',
    'Prisma', 'Docker', 'Java', 'Spring Boot', 'SQL'];
const CATEGORIAS = ['Web Apps', 'APIs', 'Full-Stack', 'Frontend', 'Backend'];

const EMPTY_FORM = {
    titulo: '', subtitulo: '', descripcion: '', imagen_url: '',
    github_url: '', demo_url: '', categoria: [] as string[],
    tecnologias: [] as string[], destacado: false, orden: 0,
};

export default function AdminPanel({ proyectos: initial }: { proyectos: Proyecto[] }) {
    const [proyectos, setProyectos] = useState(initial);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: 'POST', body: data }
        );
        const json = await res.json();
        setForm(f => ({ ...f, imagen_url: json.secure_url }));
        setUploading(false);
    };

    const toggleArray = (key: 'tecnologias' | 'categoria', val: string) => {
        setForm(f => ({
            ...f,
            [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val]
        }));
    };

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
        <div className="min-h-screen bg-[#080809] text-white">
            {/* Header */}
            <div className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
                <div>
                    <span className="text-[#FF5C00] font-mono text-xs uppercase tracking-widest">Panel Admin</span>
                    <h1 className="text-xl font-black">Gestión de Proyectos</h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={openCreate}
                        className="bg-[#FF5C00] hover:bg-[#e05200] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
                        <Plus size={15} /> Nuevo proyecto
                    </button>
                    <button onClick={handleLogout}
                        className="border border-white/10 hover:border-white/30 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-all">
                        <LogOut size={15} /> Salir
                    </button>
                </div>
            </div>

            {/* Lista */}
            <div className="max-w-5xl mx-auto px-6 py-10">
                {proyectos.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        <p className="font-mono text-sm">// No hay proyectos todavía</p>
                        <button onClick={openCreate} className="mt-4 text-[#FF5C00] text-sm hover:underline">
                            Agregá el primero →
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {proyectos.map(p => (
                            <div key={p.id}
                                className="flex items-center gap-4 bg-white/3 border border-white/8 rounded-xl px-5 py-4 hover:border-white/15 transition-all">
                                {p.imagen_url && (
                                    <img src={p.imagen_url} alt={p.titulo}
                                        className="w-14 h-14 rounded-lg object-cover shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white truncate">{p.titulo}</p>
                                    <p className="text-gray-400 text-sm truncate">{p.subtitulo}</p>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                        {p.categoria?.map(c => (
                                            <span key={c} className="text-[10px] text-[#FF5C00] border border-[#FF5C00]/30 rounded-full px-2 py-0.5">{c}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => openEdit(p)}
                                        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                                        <Pencil size={13} />
                                    </button>
                                    <button onClick={() => handleDelete(p.id)}
                                        className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-all">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={e => e.target === e.currentTarget && setShowForm(false)}>
                    <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-7 w-full max-w-xl max-h-[90vh] overflow-y-auto mx-4"
                        style={{ boxShadow: '0 0 60px rgba(255,92,0,0.1)' }}>

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black">{editingId ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
                            <button onClick={() => setShowForm(false)}
                                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                                <X size={13} />
                            </button>
                        </div>

                        <div className="h-px bg-gradient-to-r from-[#FF5C00] via-[#FF5C00]/40 to-transparent mb-6" />

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Campos de texto */}
                            {([
                                ['titulo', 'Título *', 'text', true],
                                ['subtitulo', 'Subtítulo', 'text', false],
                                ['github_url', 'GitHub URL', 'url', false],
                                ['demo_url', 'Demo URL', 'url', false],
                            ] as [keyof typeof form, string, string, boolean][]).map(([key, label, type, req]) => (
                                <div key={key} className="flex flex-col gap-1.5">
                                    <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">{label}</label>
                                    <input
                                        type={type}
                                        value={form[key] as string}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                        required={req}
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#FF5C00]/60 transition-all"
                                    />
                                </div>
                            ))}

                            {/* Descripción */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">Descripción</label>
                                <textarea
                                    value={form.descripcion}
                                    onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                                    rows={3}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#FF5C00]/60 transition-all resize-none"
                                />
                            </div>

                            {/* Imagen */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">Imagen</label>
                                <div className="flex gap-2 items-center">
                                    <label className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 cursor-pointer hover:border-[#FF5C00]/40 transition-all flex items-center gap-2">
                                        <Upload size={14} />
                                        {uploading ? 'Subiendo...' : form.imagen_url ? 'Cambiar imagen' : 'Subir imagen'}
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                    {form.imagen_url && (
                                        <img src={form.imagen_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                    )}
                                </div>
                            </div>

                            {/* Categorías */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">Categorías</label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIAS.map(cat => (
                                        <button type="button" key={cat}
                                            onClick={() => toggleArray('categoria', cat)}
                                            className={`px-3 py-1 rounded-full text-xs border transition-all ${
                                                form.categoria.includes(cat)
                                                    ? 'border-[#FF5C00] text-white bg-[#FF5C00]/10'
                                                    : 'border-white/10 text-gray-400 hover:border-white/30'
                                            }`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tecnologías */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">Tecnologías</label>
                                <div className="flex flex-wrap gap-2">
                                    {TECNOLOGIAS.map(tech => (
                                        <button type="button" key={tech}
                                            onClick={() => toggleArray('tecnologias', tech)}
                                            className={`px-3 py-1 rounded-full text-xs border transition-all ${
                                                form.tecnologias.includes(tech)
                                                    ? 'border-[#FF5C00] text-white bg-[#FF5C00]/10'
                                                    : 'border-white/10 text-gray-400 hover:border-white/30'
                                            }`}>
                                            {tech}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Destacado y Orden */}
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.destacado}
                                        onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))}
                                        className="accent-[#FF5C00]" />
                                    <span className="text-gray-400 text-sm">Destacado</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <label className="text-gray-400 text-sm">Orden</label>
                                    <input type="number" value={form.orden}
                                        onChange={e => setForm(f => ({ ...f, orden: Number(e.target.value) }))}
                                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-sm w-16 outline-none focus:border-[#FF5C00]/60 transition-all" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading || uploading}
                                className="mt-2 bg-[#FF5C00] hover:bg-[#e05200] disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                                {loading ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear proyecto'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}