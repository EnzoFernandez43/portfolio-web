'use client';

import { useState } from 'react';
import { FaReact, FaNodeJs, FaDocker, FaAws } from 'react-icons/fa';
import { SiNextdotjs, SiTypescript, SiPostgresql, SiMongodb } from 'react-icons/si';
import { Calendar, MapPin, Send, CheckCircle, Star } from 'lucide-react';

export default function SobreMiSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  const cardStyle = (i: number) => ({
    boxShadow: hovered === i
      ? '0 0 40px rgba(255,92,0,0.45), 0 0 80px rgba(255,92,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
      : '0 0 0 transparent',
    border: hovered === i ? '1px solid rgba(255,92,0,0.6)' : '1px solid #1f2026',
    transition: 'box-shadow 0.4s ease, border 0.3s ease',
  });

  return (
    <section className="min-h-screen pt-[112px] pb-16 px-6 max-w-6xl mx-auto flex flex-col gap-8">

      {/* BLOQUE 1 — HERO */}
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-8 items-start">

        {/* Izquierda */}
        <div>
          <h1 className="text-7xl font-black uppercase leading-none mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
            <span className="text-white">ENZO</span><br />
            <span className="text-[#FF5C00]">FERNANDEZ</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-xs" style={{ fontFamily: 'var(--font-barlow)' }}>
            Desarrollador Full-Stack con pasión por crear soluciones digitales que generan impacto real.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { icon: <Calendar size={18} />, title: '3+ años', sub: 'de experiencia' },
              { icon: <MapPin size={18} />, title: 'Buenos Aires, Argentina', sub: 'Disponible para trabajo remoto' },
              { icon: <Send size={18} />, title: 'Me apasiona', sub: 'Resolver problemas con código y aprender cada día algo nuevo.' },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex items-start gap-4 border-b border-[#1f2026] pb-4 last:border-0">
                <div className="w-9 h-9 rounded-lg border border-[#FF5C00] flex items-center justify-center text-[#FF5C00] shrink-0 mt-0.5">
                  {icon}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{title}</p>
                  <p className="text-gray-400 text-sm">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Centro — vacío, la imagen está en el fondo */}
        <div />

        {/* Derecha */}
        <div className="flex flex-col gap-4">
          {/* ¿Quién soy? */}
          <div
            className="bg-[#0c0d11] rounded-2xl p-6"
            style={cardStyle(0)}
            onMouseEnter={() => setHovered(0)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#FF5C00]">👤</span>
              <p className="text-white font-bold">¿Quién soy?</p>
            </div>
            <div className="flex flex-col gap-3 text-gray-400 text-sm leading-relaxed">
              <p>Soy un desarrollador full-stack enfocado en construir aplicaciones web modernas, escalables y eficientes.</p>
              <p>Disfruto transformar ideas en productos reales usando tecnologías actuales y buenas prácticas de desarrollo.</p>
              <p>Me motiva el aprendizaje constante, el trabajo en equipo y los desafíos que me sacan de mi zona de confort.</p>
            </div>
          </div>

          {/* Tiempo libre */}
          <div
            className="bg-[#0c0d11] rounded-2xl p-6"
            style={cardStyle(1)}
            onMouseEnter={() => setHovered(1)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#FF5C00]">☕</span>
              <p className="text-white font-bold">En mi tiempo libre</p>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { icon: '🏃', text: 'Me gusta entrenar y mantenerme activo' },
                { icon: '💡', text: 'Exploro nuevas tecnologías' },
                { icon: '📖', text: 'Leo sobre negocios y crecimiento personal' },
                { icon: '🎵', text: 'Escucho música para concentrarme' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-gray-400 text-sm">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BLOQUE 2 — STACK + VALORES + STATS */}
      <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4">

        {/* Stack tecnológico */}
        <div
          className="bg-[#0c0d11] rounded-2xl p-6"
          style={cardStyle(2)}
          onMouseEnter={() => setHovered(2)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#FF5C00] font-black">{`</>`}</span>
            <p className="text-white font-bold">Mi stack tecnológico</p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {[
              { icon: <FaReact size={44} className="text-[#61DAFB]" />, label: 'React' },
              { icon: <SiNextdotjs size={44} className="text-white" />, label: 'Next.js' },
              { icon: <SiTypescript size={44} className="text-[#3178C6]" />, label: 'TypeScript' },
              { icon: <FaNodeJs size={44} className="text-[#68A063]" />, label: 'Node.js' },
              { icon: <SiPostgresql size={44} className="text-[#336791]" />, label: 'PostgreSQL' },
              { icon: <SiMongodb size={44} className="text-[#47A248]" />, label: 'MongoDB' },
              { icon: <FaDocker size={44} className="text-[#2496ED]" />, label: 'Docker' },
              { icon: <FaAws size={44} className="text-[#FF9900]" />, label: 'AWS' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                {icon}
                <span className="text-gray-400 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mis valores */}
        <div
          className="bg-[#0c0d11] rounded-2xl p-6"
          style={cardStyle(3)}
          onMouseEnter={() => setHovered(3)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-[#FF5C00]" fill="#FF5C00" />
            <p className="text-white font-bold">Mis valores</p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              'Código limpio y escalable',
              'Comunicación clara',
              'Compromiso y responsabilidad',
              'Mejora continua',
            ].map(v => (
              <div key={v} className="flex items-center gap-2 text-gray-400 text-sm">
                <CheckCircle size={16} className="text-[#FF5C00] shrink-0" />
                {v}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          className="bg-[#0c0d11] rounded-2xl p-6 grid grid-cols-2 gap-4 content-center"
          style={cardStyle(4)}
          onMouseEnter={() => setHovered(4)}
          onMouseLeave={() => setHovered(null)}
        >
          {[
            { num: '10+', label: 'Proyectos\ncompletados' },
            { num: '5+', label: 'Tecnologías\ndominadas' },
            { num: '3+', label: 'Años de\nexperiencia' },
            { num: '100%', label: 'Comprometido con\ncada proyecto' },
          ].map(({ num, label }) => (
            <div key={num}>
              <p className="text-[#FF5C00] text-3xl font-black">{num}</p>
              <p className="text-gray-400 text-xs leading-tight whitespace-pre-line">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BLOQUE 3 — CTA */}
      <div className="border border-[#1f2026] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0c0d11]/60">
        <div className="flex items-center gap-4">
          <span className="text-[#FF5C00] text-3xl font-black">{`</>`}</span>
          <div>
            <p className="text-white font-bold text-lg">¿Te gustaría trabajar juntos?</p>
            <p className="text-gray-400 text-sm">Estoy siempre abierto a nuevas oportunidades y colaboraciones.</p>
          </div>
        </div>
        <a href="/contacto"
          className="bg-[#FF5C00] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all shrink-0">
          Hablemos →
        </a>
      </div>

    </section>
  );
}