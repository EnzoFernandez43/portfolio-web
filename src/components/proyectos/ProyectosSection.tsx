'use client';

import ProyectoCard from './ProyectoCard';
import { useState } from 'react';
import { FaReact, FaNodeJs, FaHtml5, FaDatabase } from 'react-icons/fa';
import { SiTypescript, SiExpress, SiPostgresql, SiMongodb, SiFirebase, SiTailwindcss, SiSocketdotio, SiCss, SiJavascript } from 'react-icons/si';

export default function ProyectosSection() {
  const [filtro, setFiltro] = useState('Todos');
  const categorias = ['Todos', 'Web Apps', 'APIs', 'Full-Stack', 'Frontend', 'Backend'];

  const proyectos = [
    {
      title: "TaskFlow",
      subtitle: "Gestor de tareas colaborativo",
      description: "Aplicación web para gestión de tareas y proyectos en equipo con tiempo real.",
      image: "/taskflow.png",
      techIcons: [<FaReact size={22} key="react"/>, <SiTypescript size={22} key="ts"/>, <FaNodeJs size={22} key="node"/>, <SiMongodb size={22} key="mongo"/>],
      githubLink: "#", projectLink: "#", highlight: false,
      categoria: "Full-Stack"
    },
    {
      title: "DevStore",
      subtitle: "E-commerce moderno",
      description: "Tienda online con carrito de compras, pagos y panel de administración.",
      image: "/devstore.png",
      techIcons: [<FaReact size={22} key="react"/>, <SiTypescript size={22} key="ts"/>, <FaNodeJs size={22} key="node"/>, <SiPostgresql size={22} key="pg"/>],
      githubLink: "#", projectLink: "#", highlight: true,
      categoria: "Full-Stack"
    },
    {
      title: "Weather API",
      subtitle: "API del clima",
      description: "API REST para consultar el clima actual y pronóstico de cualquier ciudad del mundo.",
      image: "/weather.png",
      techIcons: [<FaNodeJs size={22} key="node"/>, <SiExpress size={22} key="exp"/>, <SiPostgresql size={22} key="pg"/>],
      githubLink: "#", projectLink: "#", highlight: false,
      categoria: "APIs"
    },
    {
      title: "Finance Tracker",
      subtitle: "Control de finanzas personales",
      description: "App para registrar ingresos, gastos y visualizar estadísticas financieras.",
      image: "/finance.png",
      techIcons: [<FaReact size={22} key="react"/>, <SiTypescript size={22} key="ts"/>, <SiFirebase size={22} key="fb"/>],
      githubLink: "#", projectLink: "#", highlight: false,
      categoria: "Web Apps"
    },
    {
      title: "Portfolio v1",
      subtitle: "Mi primer portfolio",
      description: "Versión inicial de mi sitio personal, diseñado con HTML, CSS y JS.",
      image: "/portfolio-v1.png",
      techIcons: [<FaHtml5 size={22} key="html"/>, <SiCss size={22} key="css"/>, <SiJavascript size={22} key="js"/>],
      githubLink: "#", projectLink: "#", highlight: false,
      categoria: "Frontend"
    },
    {
      title: "ChatApp",
      subtitle: "Chat en tiempo real",
      description: "Aplicación de mensajería en tiempo real con salas públicas y privadas.",
      image: "/chat.png",
      techIcons: [<FaReact size={22} key="react"/>, <FaNodeJs size={22} key="node"/>, <SiSocketdotio size={22} key="io"/>],
      githubLink: "#", projectLink: "#", highlight: false,
      categoria: "Full-Stack"
    },
  ];

  const filtrados = filtro === 'Todos' ? proyectos : proyectos.filter(p => p.categoria === filtro);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-5xl font-black text-white uppercase">
            MIS <span className="text-[#FF5C00]">PROYECTOS</span>
          </h2>
          <div className="w-16 h-1 bg-[#FF5C00] mt-3" />
          <p className="text-gray-400 mt-3 max-w-md">
            Una selección de proyectos en los que he trabajado, solucionando problemas reales con código y creatividad.
          </p>
        </div>
        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filtro === cat
                  ? 'bg-transparent border-[#FF5C00] text-white'
                  : 'border-[#2a2b33] text-gray-400 hover:border-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtrados.map((p, i) => (
          <ProyectoCard key={i} {...p} />
        ))}
      </div>

      {/* Banner CTA */}
      <div className="mt-16 border border-[#1f2026] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0c0d11]/60">
        <div className="flex items-center gap-4">
          <span className="text-[#FF5C00] text-3xl font-black">{`</>`}</span>
          <div>
            <p className="text-white font-bold text-lg">¿Tienes una idea o proyecto en mente?</p>
            <p className="text-gray-400 text-sm">Estoy disponible para nuevos desafíos y colaboraciones.</p>
          </div>
        </div>
        
        <a
          href="#contacto"
          className="bg-[#FF5C00] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all shrink-0"
        >
          Hablemos →
        </a>
      </div>
    </section>
  );
}