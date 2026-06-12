'use client';

import { useEffect, useState } from 'react';

const lines = ['Código limpio', 'Diseño intuitivo', 'Soluciones reales'];

export default function CodeCard() {
  const [visible, setVisible] = useState(false);
  const [typing, setTyping] = useState(false);
  const [displayed, setDisplayed] = useState<string[]>(['', '', '']);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Paso 1: card se despliega al cargar
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Paso 2: después de que aparece, empieza el typing
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setTyping(true), 700);
      return () => clearTimeout(t);
    }
  }, [visible]);

  // Paso 3: typewriter
  useEffect(() => {
    if (!typing || currentLine >= lines.length) return;
    const timeout = setTimeout(() => {
      const target = lines[currentLine];
      if (currentChar < target.length) {
        setDisplayed(prev => {
          const next = [...prev];
          next[currentLine] = target.slice(0, currentChar + 1);
          return next;
        });
        setCurrentChar(c => c + 1);
      } else {
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }
    }, currentChar === 0 && currentLine > 0 ? 350 : 45);
    return () => clearTimeout(timeout);
  }, [typing, currentLine, currentChar]);

  return (
    <div
      className="hidden md:block absolute top-[12%] right-[3%] z-20"
      style={{ width: '320px', height: '260px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Overlay invisible que captura el hover en área rectangular */}
      <div className="absolute inset-0 z-10" />
      
      {/* Card visual */}
      <div
        className="absolute top-0 right-0 w-[260px] h-full p-7 rounded-2xl flex flex-col gap-5"
        style={{
          background: 'rgba(12, 8, 4, 0.55)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 92, 0, 0.25)',
          boxShadow: hovered
            ? '0 0 40px rgba(255,92,0,0.25), 0 0 80px rgba(255,92,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08), -6px 0 20px rgba(255,92,0,0.15)'
            : '0 0 25px rgba(255,92,0,0.15), 0 0 60px rgba(255,92,0,0.07), inset 0 1px 0 rgba(255,255,255,0.05), -4px 0 15px rgba(255,92,0,0.1)',
          transform: visible
            ? hovered
              ? 'perspective(800px) rotateY(-6deg) rotateX(2deg) scale(1.03)'
              : 'perspective(800px) rotateY(-20deg) rotateX(5deg)'
            : 'perspective(800px) rotateY(-20deg) rotateX(5deg) translateY(-30px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.5s ease, box-shadow 0.4s ease, opacity 0.6s ease',
        }}
      >
        {/* Borde izquierdo con glow naranja */}
        <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,92,0,0.6), transparent)' }}
        />

        {/* Ícono */}
        <div className="text-[#FF5C00] text-3xl font-black" style={{ fontFamily: 'monospace' }}>
          {'</>'}
        </div>

        {/* Líneas */}
        <div className="flex flex-col gap-3">
          {displayed.map((line, i) => (
            <div key={i} className="text-white text-base font-medium min-h-[24px]"
              style={{ fontFamily: 'var(--font-montserrat)' }}>
              {line}
              {typing && currentLine === i && currentChar < lines[i].length && (
                <span className="animate-pulse text-[#FF5C00]">|</span>
              )}
            </div>
          ))}
        </div>

        {/* Barra naranja */}
        <div className="w-10 h-[3px] bg-[#FF5C00] rounded-full mt-1" />
      </div>
    </div>
  );
}