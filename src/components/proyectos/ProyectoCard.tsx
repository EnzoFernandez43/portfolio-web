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
      className={`p-5 rounded-2xl bg-[#0c0d11] border ${highlight ? 'border-[#FF5C00]' : 'border-[#1f2026]'} transition-all duration-300`}
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
      <div className="flex gap-4">
        <div className="w-[45%] h-36 bg-gray-800 rounded-lg overflow-hidden shrink-0">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <span className="text-[#FF5C00] font-semibold text-sm mb-2">{subtitle}</span>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
          <div className="flex gap-3 mt-auto pt-3">
            {techIcons.map((icon, i) => (
              <div key={i} className="text-gray-400 hover:text-white transition-colors">{icon}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-[#1f2026]">
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