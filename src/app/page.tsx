import { ArrowRight, Send } from 'lucide-react';
import { FaReact, FaNodeJs, FaDocker, FaDatabase } from 'react-icons/fa';
import { SiNextdotjs, SiTypescript } from 'react-icons/si';
import CodeCard from '@/components/CodeCard';

export default function Home() {
  return (
    <main className="bg-transparent">
      {/* Sección principal */}
      <div className="relative min-h-screen h-screen flex items-start md:items-center justify-center overflow-visible md:overflow-hidden pb-32 md:py-0">
        <CodeCard />

        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-12 px-6 max-w-6xl w-full z-10">
          {/* Columna Izquierda */}
          <div className="flex flex-col justify-center gap-2 mt-2 md:mt-16">
            <div>
              <h1 className="text-6xl md:text-7xl text-white leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>Enzo</h1>
              <h1 className="text-[4.5rem] md:text-[6rem] text-[#FF5C00] leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>Fernandez</h1>
            </div>
            
            <p className="font-semibold text-xl text-white" style={{ fontFamily: 'var(--font-barlow)' }}>
              Estudiante de Ingeniería en Sistemas | Desarrollador Full-Stack
            </p>

            <p className="text-gray-300 text-lg leading-relaxed max-w-xl" style={{ fontFamily: 'var(--font-barlow)' }}>
              Transformo ideas en aplicaciones web modernas, escalables y eficientes. 
              Me apasiona crear soluciones que generen impacto real a través de la tecnología.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <a href="/proyectos"
                className="group bg-[#FF5C00] hover:bg-[#e05200] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
                style={{ fontFamily: 'var(--font-barlow)' }}>
                Ver mis proyectos <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="/contacto"
                className="group border border-white/40 hover:border-white text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
                style={{ fontFamily: 'var(--font-barlow)' }}>
                Contactar <Send size={16} className="transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </div>

            {/* Tecnologías */}
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-3">Tecnologías principales</p>
              <div className="grid grid-cols-3 sm:flex gap-3">
                {[
                  { icon: <FaReact size={24} className="text-[#61DAFB]" />, bg: 'bg-black/60', label: 'React' },
                  { icon: <SiNextdotjs size={24} className="text-white" />, bg: 'bg-black/60', label: 'Next.js' },
                  { icon: <SiTypescript size={24} className="text-[#3178C6]" />, bg: 'bg-black/60', label: 'TypeScript' },
                  { icon: <FaNodeJs size={24} className="text-[#68A063]" />, bg: 'bg-black/60', label: 'Node.js' },
                  { icon: <FaDatabase size={24} className="text-[#336791]" />, bg: 'bg-black/60', label: 'PostgreSQL' },
                  { icon: <FaDocker size={24} className="text-[#2496ED]" />, bg: 'bg-black/60', label: 'Docker' },
                ].map((tech, i) => (
                  <div key={i} className="group flex flex-col items-center gap-1">
                    <div className={`w-12 h-12 rounded-xl ${tech.bg} border border-white/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:border-[#FF5C00]/50`}>
                      {tech.icon}
                    </div>
                    <span className="text-white/70 text-xs sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200" style={{ fontFamily: 'var(--font-barlow)' }}>
                      {tech.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div />
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 md:block hidden">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#FF5C00] rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </main>
  );
}
