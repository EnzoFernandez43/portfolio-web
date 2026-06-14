'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import ProyectoCard from './ProyectoCard';
import { Proyecto, deleteProyecto } from '@/actions/proyectos';
import { getTechIcon } from '@/lib/techIcons';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const CATEGORIAS = ['Todos', 'Web Apps', 'APIs', 'Full-Stack', 'Frontend', 'Backend'];

export default function ProyectosSection({ proyectos: initial }: { proyectos: Proyecto[] }) {
  const [filtro, setFiltro] = useState('Todos');
  const [proyectos, setProyectos] = useState(initial);
  const { isAdmin } = useAuth();
  const router = useRouter();

  const filtrados = filtro === 'Todos' ? proyectos : proyectos.filter(p => p.categoria?.includes(filtro));

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminás este proyecto?')) return;
    await deleteProyecto(id);
    setProyectos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <section className="pt-[112px] pb-20 px-6 max-w-6xl mx-auto">
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
            projectLink={`/detalleproyecto/${p.id}`}
            highlight={p.destacado}
            onDelete={() => handleDelete(p.id)}
          />
        ))}

        {/* Card agregar — solo en modo admin */}
        {isAdmin && (
          <button onClick={() => router.push('/proyectos/nuevo')}
            className="h-full min-h-[280px] flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#FF5C00]/50 hover:bg-[#FF5C00]/5 transition-all group">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 group-hover:border-[#FF5C00]/60 flex items-center justify-center transition-all">
              <Plus size={22} className="text-white/30 group-hover:text-[#FF5C00] transition-colors" />
            </div>
            <span className="text-white/30 group-hover:text-[#FF5C00] text-sm font-medium transition-colors">Agregar proyecto</span>
          </button>
        )}
      </div>

      {/* CTA */}
      <div className="mt-16 relative border border-[#1f2026] rounded-2xl p-8 md:p-10 overflow-hidden bg-[#0c0d11]/60 flex flex-col md:flex-row items-center md:justify-between gap-6 text-center md:text-left">
        {/* Icono decorativo de fondo */}
        <span className="absolute -right-4 -top-6 text-[#FF5C00]/10 text-[10rem] font-black leading-none pointer-events-none select-none">
          {`</>`}
        </span>

        <div className="relative z-10 flex flex-col items-center md:items-start gap-2">
          <span className="text-[#FF5C00] text-2xl font-black">{`</>`}</span>
          <p className="text-white font-bold text-xl md:text-lg">¿Tienes una idea o proyecto en mente?</p>
          <p className="text-gray-400 text-sm max-w-sm">Estoy disponible para nuevos desafíos y colaboraciones.</p>
        </div>

        <a href="/contacto"
          className="relative z-10 bg-[#FF5C00] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all shrink-0 w-full sm:w-auto justify-center">
          Hablemos →
        </a>
      </div>
    </section>
  );
}
