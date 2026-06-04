import { ArrowRight, Send } from 'lucide-react';
import { FaReact, FaNodeJs, FaDocker, FaDatabase } from 'react-icons/fa';
import { SiNextdotjs, SiTypescript } from 'react-icons/si';

export default function Home() {
  return (
    <div className="relative h-full flex items-center justify-center overflow-hidden">
      {/* Fondo */}
      <img
        src="/fondoDePantalla.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-12 px-6 max-w-6xl w-full z-10">

        {/* Columna Izquierda */}
        <div className="flex flex-col justify-center gap-4 mt-16">

          {/* Nombre */}
          <div>
            <h1 className="text-7xl text-white leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>Enzo</h1>
            <h1 className="text-[6rem] text-[#FF5C00] leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>Fernandez</h1>
          </div>

          {/* Subtítulo */}
          <p className="font-semibold text-xl text-white" style={{ fontFamily: 'var(--font-barlow)' }}>
            Ingeniero en Sistemas | Desarrollador Full-Stack
          </p>

          {/* Descripción */}
          <p className="text-gray-300 text-base leading-relaxed max-w-xl" style={{ fontFamily: 'var(--font-barlow)' }}>
            Transformo ideas en aplicaciones web modernas, escalables y eficientes. 
            Me apasiona crear soluciones que generen impacto real a través de la tecnología.
          </p>

          {/* Botones */}
          <div className="flex gap-4 mt-2">
            <a href="/proyectos"
              className="bg-[#FF5C00] hover:bg-[#e05200] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              style={{ fontFamily: 'var(--font-barlow)' }}>
              Ver mis proyectos <ArrowRight size={18} />
            </a>
            <a href="/contacto"
              className="border border-white/40 hover:border-white text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              style={{ fontFamily: 'var(--font-barlow)' }}>
              Contactar <Send size={16} />
            </a>
          </div>

          {/* Tecnologías */}
          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-3">Tecnologías principales</p>
            <div className="flex gap-3">
              {[
                { icon: <FaReact size={24} className="text-[#61DAFB]" />, bg: 'bg-black/60' },
                { icon: <SiNextdotjs size={24} className="text-white" />, bg: 'bg-white/10' },
                { icon: <SiTypescript size={24} className="text-[#3178C6]" />, bg: 'bg-black/60' },
                { icon: <FaNodeJs size={24} className="text-[#68A063]" />, bg: 'bg-black/60' },
                { icon: <FaDatabase size={24} className="text-[#336791]" />, bg: 'bg-black/60' },
                { icon: <FaDocker size={24} className="text-[#2496ED]" />, bg: 'bg-black/60' },
              ].map((tech, i) => (
                <div key={i} className={`w-12 h-12 rounded-xl ${tech.bg} border border-white/10 flex items-center justify-center`}>
                  {tech.icon}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Columna Derecha: vacía (la llena la imagen de fondo) */}
        <div />

      </div>
    </div>
  );
}