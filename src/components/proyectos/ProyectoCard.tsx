'use client';

import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { ArrowRight } from 'lucide-react';

interface CardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  techIcons: React.ReactNode[];
  githubLink: string;
  projectLink: string;
  highlight?: boolean;
}

export default function ProyectoCard({ title, subtitle, description, image, techIcons, githubLink, projectLink, highlight }: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`h-full flex flex-col p-5 rounded-2xl bg-[#0c0d11] border ${highlight ? 'border-[#FF5C00]' : 'border-[#1f2026]'}`}
      style={{
        boxShadow: hovered
          ? '0 0 40px rgba(255,92,0,0.45), 0 0 80px rgba(255,92,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 0 0 transparent',
        border: hovered ? '1px solid rgba(255,92,0,0.6)' : undefined,
        transition: 'box-shadow 0.4s ease, border 0.3s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagen fija */}
      <div className="w-full h-36 bg-gray-800 rounded-lg overflow-hidden shrink-0 mb-4">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Contenido que crece */}
      <div className="flex flex-col flex-1 min-h-0">
        <h3 className="text-base font-bold text-white leading-tight line-clamp-1">{title}</h3>
        <span className="text-[#FF5C00] font-semibold text-xs mt-0.5 mb-2 line-clamp-1">{subtitle}</span>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1">{description}</p>

        {/* Íconos */}
        <div className="flex gap-3 pt-3">
          {techIcons.map((icon, i) => (
            <div key={i} className="text-gray-400 hover:text-white transition-colors">{icon}</div>
          ))}
        </div>
      </div>

      {/* Footer siempre al fondo */}
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