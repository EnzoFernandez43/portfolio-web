'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GitBranch, ExternalLink, Star, Calendar, Tag } from 'lucide-react';
import { Proyecto } from '@/actions/proyectos';
import { getTechIcon } from '@/lib/techIcons';
import { ImageLightbox } from '@/components/ImageLightbox';

export default function DetalleProyectoSection({ proyecto }: { proyecto: Proyecto & { imagenes_muestra?: string[] } }) {
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const imagenes = proyecto.imagenes_muestra?.filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-[#050507] text-white" style={{ fontFamily: 'var(--font-barlow)' }}>

      {/* ── Hero: Imagen con botón volver superpuesto ── */}
      <div className="relative w-full h-[480px] md:h-[560px] overflow-hidden">
        {proyecto.imagen_url ? (
          <img
            src={proyecto.imagen_url}
            alt={proyecto.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#0c0d11]" />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

        {/* Botón volver */}
        <div className="absolute top-6 left-0 right-0">
          <div className="max-w-6xl mx-auto px-6">
            <button
              onClick={() => router.push('/proyectos')}
              className="flex items-center gap-2 text-white hover:text-white text-sm transition-all group bg-[#FF5C00]/80 hover:bg-[#FF5C00] backdrop-blur-sm border border-[#FF5C00] rounded-full px-4 py-2"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Volver a proyectos
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FF5C00]/40 to-transparent" />

      {/* ── Title, Badges + contenido principal ── */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Columna izquierda: título + contenido ── */}
          <div className="flex-1 min-w-0">

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {proyecto.destacado && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF5C00] text-white text-xs font-bold uppercase tracking-wide">
                  <Star size={10} fill="white" /> Destacado
                </span>
              )}
              {(proyecto.categoria ?? []).map(cat => (
                <span key={cat} className="px-3 py-1 rounded-full border border-[#FF5C00]/50 text-[#FF5C00] text-xs font-semibold">
                  {cat}
                </span>
              ))}
            </div>

            <h1
              className="text-5xl md:text-7xl font-black text-white uppercase mb-3 leading-none"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              {proyecto.titulo}
            </h1>
            <div className="w-12 h-[3px] bg-[#FF5C00] rounded-full mb-3" />
            {proyecto.subtitulo && (
              <p className="text-[#FF7A30] text-base font-medium max-w-xl leading-relaxed mb-12">
                {proyecto.subtitulo}
              </p>
            )}

            {/* Descripción rich text */}
            {proyecto.descripcion && (
              <div
                className="prose-custom mb-12"
                dangerouslySetInnerHTML={{ __html: proyecto.descripcion }}
              />
            )}

            {/* Imágenes de muestra */}
            {imagenes.length > 0 && (
              <div className="mb-12">
                <h2
                  className="text-2xl font-black text-white uppercase mb-6"
                  style={{ fontFamily: 'var(--font-bebas)' }}
                >
                  CAPTURAS <span className="text-[#FF5C00]">DEL PROYECTO</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {imagenes.map((url, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-[#1a1b22] group cursor-pointer"
                      onClick={() => setLightboxIndex(i)}
                    >
                      <img
                        src={url}
                        alt={`Captura ${i + 1}`}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar derecho ── */}
          <div className="lg:w-72 shrink-0 flex flex-col gap-5">

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              {proyecto.demo_url && (
                <a
                  href={proyecto.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF5C00] hover:bg-orange-600 text-white font-semibold text-sm transition-all"
                >
                  <ExternalLink size={15} />
                  Ver demo en vivo
                </a>
              )}
              {proyecto.github_url && (
                <a
                  href={proyecto.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-[#FF5C00]/40 hover:bg-[#FF5C00]/5 text-gray-300 hover:text-white font-medium text-sm transition-all"
                >
                  <GitBranch size={15} />
                  Ver código en GitHub
                </a>
              )}
            </div>

            {/* Tecnologías */}
            {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
              <div className="bg-[#0c0d11] border border-[#1a1b22] rounded-2xl p-5">
                <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-4">
                  Stack tecnológico
                </h3>
                <div className="flex flex-wrap gap-3">
                  {proyecto.tecnologias.map(tech => (
                    <div key={tech} className="flex flex-col items-center gap-1.5 group">
                      <div className="w-10 h-10 rounded-xl bg-[#080809] border border-[#1a1b22] flex items-center justify-center text-white/70 group-hover:border-[#FF5C00]/30 group-hover:text-white transition-all [&>svg]:w-5 [&>svg]:h-5">
                        {getTechIcon(tech)}
                      </div>
                      <span className="text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── CTA bottom ── */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="border border-[#1f2026] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0c0d11]/60">
          <div className="flex items-center gap-4">
            <span className="text-[#FF5C00] text-3xl font-black">{`</>`}</span>
            <div>
              <p className="text-white font-bold text-lg">¿Te interesa este tipo de proyecto?</p>
              <p className="text-gray-400 text-sm">Estoy disponible para nuevos desafíos y colaboraciones.</p>
            </div>
          </div>
          <a
            href="/contacto"
            className="bg-[#FF5C00] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all shrink-0"
          >
            Hablemos →
          </a>
        </div>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={imagenes}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* ── Prose styles (scoped) ── */}
      <style jsx global>{`
        .prose-custom h1 { font-size: 2rem; font-weight: 900; color: white; margin-bottom: 0.75rem; margin-top: 2rem; font-family: var(--font-bebas); letter-spacing: 0.02em; }
        .prose-custom h2 { font-size: 1.5rem; font-weight: 700; color: white; margin-bottom: 0.5rem; margin-top: 1.75rem; }
        .prose-custom h3 { font-size: 1.1rem; font-weight: 600; color: white; margin-bottom: 0.4rem; margin-top: 1.5rem; }
        .prose-custom p  { color: #9ca3af; font-size: 0.95rem; line-height: 1.8; margin-bottom: 1rem; }
        .prose-custom ul { list-style: disc; padding-left: 1.25rem; margin-bottom: 1rem; }
        .prose-custom ol { list-style: decimal; padding-left: 1.25rem; margin-bottom: 1rem; }
        .prose-custom li { color: #9ca3af; font-size: 0.9rem; line-height: 1.7; margin-bottom: 0.3rem; }
        .prose-custom blockquote { border-left: 2px solid #FF5C00; padding-left: 1rem; color: #6b7280; font-style: italic; margin: 1.25rem 0; }
        .prose-custom pre  { background: #000; border-radius: 0.75rem; padding: 1rem; margin: 1rem 0; overflow-x: auto; }
        .prose-custom code { font-family: monospace; font-size: 0.8rem; color: #4ade80; }
        .prose-custom a    { color: #FF5C00; text-decoration: underline; }
        .prose-custom hr   { border-color: #1a1b22; margin: 2rem 0; }
        .prose-custom strong { color: white; font-weight: 700; }
        .prose-custom figure { margin: 1.5rem 0; }
        .prose-custom figure img { border-radius: 0.75rem; width: 100%; }
        .prose-custom figcaption { text-align: center; font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem; }
        .prose-custom .img-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin: 1.5rem 0; }
        .prose-custom .img-grid img { border-radius: 0.5rem; width: 100%; height: 100%; object-fit: cover; }
      `}</style>
    </div>
  );
}
