'use client';

import Link from 'next/link';
import { Download } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Inicio' },
        { href: '/proyectos', label: 'Proyectos' },
        { href: '/sobre-mi', label: 'Sobre mí' },
        { href: '/contacto', label: 'Contacto' },
    ];

    return (
        <nav className="fixed top-0 z-50 w-full bg-transparent">
            <div className="w-full px-8 md:px-16 h-[72px] flex items-center justify-between relative">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="text-[#FF5C00] font-black text-5xl leading-none tracking-tighter">
                        EF
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-white font-bold text-base leading-tight">
                            Enzo Fernandez
                        </span>
                        <span className="text-gray-400 text-xs leading-tight">
                            Full-Stack Developer
                        </span>
                    </div>
                </div>

                {/* Centro */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
                    {links.map(({ href, label }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`text-base font-medium relative py-2 transition-colors ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                {label}
                                {active && <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF5C00] rounded-full" />}
                            </Link>
                        );
                    })}
                </div>

                {/* Derecha */}
                <div className="hidden md:flex items-center gap-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all">
                        <FaGithub size={18} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all">
                        <FaLinkedin size={18} />
                    </a>
                    <button className="bg-[#FF5C00] hover:bg-[#e05200] text-white px-7 py-2.5 rounded-full font-semibold text-base flex items-center gap-2 transition-colors">
                        Descargar CV
                        <Download size={16} strokeWidth={2.5} />
                    </button>
                </div>

            </div>
        </nav>
    );
}