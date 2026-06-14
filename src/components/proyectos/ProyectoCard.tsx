'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaGithub } from 'react-icons/fa';
import { ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface CardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  techIcons: React.ReactNode[];
  githubLink: string;
  projectLink: string;
  highlight?: boolean;
  onDelete?: () => void;
}

const extractFirstParagraph = (html: string): string => {
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
  if (!match) return html.replace(/<[^>]*>/g, '').trim();
  return match[1].replace(/<[^>]*>/g, '').trim();
};

export default function ProyectoCard({ id, title, subtitle, description, image, techIcons, githubLink, projectLink, highlight, onDelete }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Modal de confirmación (usando Portal) */}
      {mounted && showConfirm && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-[#0c0d11] border border-[#1f2026] rounded-2xl p-6 w-80 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-base mb-1">Eliminar proyecto</h3>
            <p className="text-gray-400 text-sm mb-6">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-[#1f2026] text-gray-400 hover:text-white hover:border-white/20 text-sm transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setShowConfirm(false); onDelete?.(); }}
                className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/60 text-sm transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div
        onClick={() => router.push(projectLink)}
        className={`relative h-full flex flex-col p-5 rounded-2xl bg-[#0c0d11] border cursor-pointer ${highlight ? 'border-[#FF5C00]' : 'border-[#1f2026]'}`}
        style={{
          boxShadow: hovered ? '0 0 40px rgba(255,92,0,0.45), 0 0 80px rgba(255,92,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)' : '0 0 0 transparent',
          border: hovered ? '1px solid rgba(255,92,0,0.6)' : undefined,
          transition: 'box-shadow 0.4s ease, border 0.3s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Botones admin */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-1.5 z-10">
            <button onClick={(e) => { e.stopPropagation(); router.push(`/proyectos/${id}/editar`); }}
              className="w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all backdrop-blur-sm">
              <Pencil size={12} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
              className="w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-400/40 transition-all backdrop-blur-sm">
              <Trash2 size={12} />
            </button>
          </div>
        )}

        <div className="w-full h-36 bg-gray-800 rounded-lg overflow-hidden shrink-0 mb-4">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <h3 className="text-base font-bold text-white leading-tight line-clamp-1">{title}</h3>
          <span className="text-[#FF5C00] font-semibold text-xs mt-0.5 mb-2 line-clamp-1">{subtitle}</span>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1">
            {extractFirstParagraph(description)}
          </p>
          {/* Iconos con límite y +n */}
          {(() => {
            const MAX_MOBILE = 6;
            const MAX_DESKTOP = 9;
            const visible = techIcons.slice(0, MAX_DESKTOP);
            const extraMobile = techIcons.length - MAX_MOBILE;
            const extraDesktop = techIcons.length - MAX_DESKTOP;
            return (
              <div className="flex items-center gap-2 pt-3 flex-wrap">
                {visible.map((icon, i) => (
                  <div key={i} className={`w-6 h-6 text-gray-400 hover:text-white transition-colors shrink-0 [&>svg]:w-full [&>svg]:h-full ${i >= MAX_MOBILE ? 'hidden sm:block' : ''}`}>
                    {icon}
                  </div>
                ))}
                {extraMobile > 0 && (
                  <span className="text-[10px] text-gray-500 font-mono shrink-0 sm:hidden">+{extraMobile}</span>
                )}
                {extraDesktop > 0 && (
                  <span className="text-[10px] text-gray-500 font-mono shrink-0 hidden sm:inline">+{extraDesktop}</span>
                )}
              </div>
            );
          })()}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1f2026] shrink-0">
          <a href={projectLink} onClick={(e) => e.stopPropagation()} className="text-[#FF5C00] font-semibold flex items-center gap-2 hover:underline text-sm">
            Ver proyecto <ArrowRight size={16} />
          </a>
          <a href={githubLink} onClick={(e) => e.stopPropagation()} className="text-white hover:text-[#FF5C00] transition-colors">
            <FaGithub size={22} />
          </a>
        </div>
      </div>
    </>
  );
}
