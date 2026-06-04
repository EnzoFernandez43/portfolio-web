import Link from 'next/link';
import { Download } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">

                {/* Lado Izquierdo: Logo y Textos */}
                <div className="flex items-center gap-3">
                    <div className="text-[#FF5C00] font-black text-4xl leading-none tracking-tighter">
                        EF
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-white font-bold text-lg leading-tight">
                            Enzo Fernandez
                        </span>
                        <span className="text-gray-400 text-sm leading-tight">
                            Full-Stack Developer
                        </span>
                    </div>
                </div>

                {/* Centro: Enlaces (Centrado absoluto) */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8">
                    <Link href="/" className="text-white text-sm font-medium relative py-2">
                        Inicio
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF5C00] rounded-t-full"></span>
                    </Link>
                    <Link href="/proyectos" className="text-gray-400 hover:text-white transition-colors text-sm font-medium py-2">
                        Proyectos
                    </Link>
                    <Link href="/sobre-mi" className="text-gray-400 hover:text-white transition-colors text-sm font-medium py-2">
                        Sobre mí
                    </Link>
                    <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors text-sm font-medium py-2">
                        Contacto
                    </Link>
                </div>

                {/* Lado Derecho: Redes y Botón CV */}
                <div className="hidden md:flex items-center gap-4">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-gray-400 transition-all"
                    >
                        <FaGithub size={18} strokeWidth={2} />
                    </a>

                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white hover:border-gray-400 transition-all"
                    >
                        <FaLinkedin size={18} strokeWidth={2} />
                    </a>

                    <button className="bg-[#FF5C00] hover:bg-[#e05200] text-white px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors">
                        Descargar CV
                        <Download size={16} strokeWidth={2.5} />
                    </button>
                </div>

            </div>
        </nav>
    );
}