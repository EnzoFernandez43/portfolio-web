'use client';

import { useEffect, useState } from 'react';

const lines = ['Código limpio', 'Diseño intuitivo', 'Soluciones reales'];

export default function CodeCard() {
  const [displayed, setDisplayed] = useState<string[]>(['', '', '']);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (currentLine >= lines.length) return;
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
    }, currentChar === 0 && currentLine > 0 ? 400 : 50);
    return () => clearTimeout(timeout);
  }, [currentLine, currentChar]);

  return (
    <div
      className="absolute top-[12%] right-[3%] w-[260px] p-7 rounded-2xl border border-white/10 flex flex-col gap-5 cursor-pointer"
      style={{
        background: 'rgba(10, 10, 10, 0.75)',
        backdropFilter: 'blur(16px)',
        transform: hovered
          ? 'perspective(800px) rotateY(-4deg) rotateX(2deg) scale(1.03)'
          : 'perspective(800px) rotateY(-14deg) rotateX(4deg)',
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ícono */}
      <div className="text-[#FF5C00] text-3xl font-black" style={{ fontFamily: 'monospace' }}>
        {'</>'}
      </div>

      {/* Líneas */}
      <div className="flex flex-col gap-3">
        {displayed.map((line, i) => (
          <div key={i} className="text-white text-base font-medium" style={{ fontFamily: 'var(--font-montserrat)' }}>
            {line}
            {currentLine === i && currentChar > 0 && currentChar < lines[i].length && (
              <span className="animate-pulse">|</span>
            )}
          </div>
        ))}
      </div>

      {/* Barra naranja */}
      <div className="w-10 h-[3px] bg-[#FF5C00] rounded-full mt-1" />
    </div>
  );
}