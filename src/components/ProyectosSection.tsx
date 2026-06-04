import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { proyectos } from '@/data/proyectos';

export default function ProyectosSection() {
  return (
    <section className="py-20 px-8 md:px-24 bg-[#0f172a]" style={{ fontFamily: 'var(--font-barlow)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12">Mis Proyectos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {proyectos.map((proyecto) => (
            <div 
              key={proyecto.id} 
              className="bg-[#1e293b]/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[#FF5C00]/50 transition-all group"
            >
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF5C00] transition-colors">
                {proyecto.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {proyecto.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {proyecto.tech.map((t) => (
                  <span key={t} className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/5">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <a href={proyecto.link} className="flex items-center gap-2 text-sm text-white hover:text-[#FF5C00] transition-colors">
                  <ExternalLink size={16} /> Demo
                </a>
                <a href={proyecto.github} className="flex items-center gap-2 text-sm text-white hover:text-[#FF5C00] transition-colors">
                  <FaGithub size={16} /> Código
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}