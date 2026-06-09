'use client';

import { useState } from 'react';
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

export default function ProyectoCard({ id, title, subtitle, description, image, techIcons, githubLink, projectLink, highlight, onDelete }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const { isAdmin } = useAuth();
  const router = useRouter();

  return (
    <div
      className={`relative h-full flex flex-col p-5 rounded-2xl bg-[#0c0d11] border ${highlight ? 'border-[#FF5C00]' : 'border-[#1f2026]'}`}
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
          <button onClick={() => router.push(`/proyectos/${id}/editar`)}
            className="w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all backdrop-blur-sm">
            <Pencil size={12} />
          </button>
          <button onClick={onDelete}
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
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1">{description}</p>
        <div className="flex gap-3 pt-3">
          {techIcons.map((icon, i) => (
            <div key={i} className="text-gray-400 hover:text-white transition-colors">{icon}</div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1f2026] shrink-0">
        <a href={projectLink} className="text-[#FF5C00] font-semibold flex items-center gap-2 hover:underline text-sm">
          Ver proyecto <ArrowRight size={16} />
        </a>
        <a href={githubLink} className="text-white hover:text-[#FF5C00] transition-colors">
          <FaGithub size={22} />
        </a>
      </div>
    </div>
  );
}