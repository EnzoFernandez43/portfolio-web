'use client';

import Link from 'next/link';
import { Download, X, LogIn } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState('');
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const clickCountRef = useRef(0);
    const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router = useRouter();
    const { isAdmin } = useAuth(); // Get isAdmin from useAuth

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setLightboxOpen(document.body.hasAttribute('data-lightbox-open'));
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['data-lightbox-open'] });
        return () => observer.disconnect();
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setScrolled(detail.scrollTop > 10);
        };
        window.addEventListener('app-scroll', handler);

        // Fallback for native scroll on mobile
        const nativeHandler = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', nativeHandler);

        return () => {
            window.removeEventListener('app-scroll', handler);
            window.removeEventListener('scroll', nativeHandler);
        };
    }, []);

    // Cerrar modal con Escape
    useEffect(() => {
        if (!modalOpen) return;
        const handler = (e: KeyboardEvent) => e.key === 'Escape' && setModalOpen(false);
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [modalOpen]);

    const handleSecretClick = useCallback(() => {
        clickCountRef.current += 1;
        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        if (clickCountRef.current >= 3) {
            clickCountRef.current = 0;
            setModalOpen(true);
            return;
        }
        clickTimerRef.current = setTimeout(() => {
            clickCountRef.current = 0;
        }, 600);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError('Credenciales incorrectas');
            setLoading(false);
            return;
        }

        setModalOpen(false);
        setEmail('');
        setPassword('');
        showToast('✓ Modo admin activado');
        setLoading(false);
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        showToast('Sesión cerrada');
    };

    const links = [
        { href: '/', label: 'Inicio' },
        { href: '/proyectos', label: 'Proyectos' },
        { href: '/sobre-mi', label: 'Sobre mí' },
        { href: '/contacto', label: 'Contacto' },
    ];

    const hiddenRoutes = ['/proyectos/nuevo', '/editar'];
    const isHidden = hiddenRoutes.some(route => pathname.includes(route)) 
      || pathname.startsWith('/detalleproyecto/');

    if (isHidden) return null;

    return (
        <>
            <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${lightboxOpen ? 'opacity-0 pointer-events-none' : ''} ${scrolled ? 'bg-black/40 backdrop-blur-xl border-b border-white/10' : 'bg-transparent border-b border-transparent'} md:bg-transparent max-md:bg-black/50 max-md:backdrop-blur-xl max-md:border-b max-md:border-white/10`}>
                <div className="w-full px-8 md:px-16 h-[72px] grid grid-cols-[1fr_auto_1fr] items-center">

                    {/* Logo con botón secreto embebido */}
                    <div className="flex items-center gap-3">
                        <div
                            onClick={handleSecretClick}
                            className="text-[#FF5C00] font-black text-5xl leading-none tracking-tighter select-none"
                            style={{ cursor: 'default' }}
                        >
                            EF
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-white font-bold text-base leading-tight">Enzo Fernandez</span>
                            <span className="text-gray-400 text-xs leading-tight">Full-Stack Developer</span>
                        </div>
                        {isAdmin && (
                            <button onClick={handleLogout}
                                className="text-gray-400 hover:text-white text-xs font-mono border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-full transition-all ml-2">
                                Salir del modo admin
                            </button>
                        )}
                    </div>

                    {/* Centro */}
                    <div className="hidden md:flex items-center lg:gap-10 md:gap-6">
                        {links.map(({ href, label }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`text-base font-medium relative py-2 transition-colors ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {label}
                                    <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-[#FF5C00] rounded-full transition-all duration-300 ${active ? 'w-full' : 'w-0'}`} />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Derecha */}
                    <div className="hidden md:flex items-center gap-4 justify-end">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all">
                            <FaGithub size={18} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all">
                            <FaLinkedin size={18} />
                        </a>
                        <button className="hidden xl:flex bg-[#FF5C00] hover:bg-[#e05200] text-white px-7 py-2.5 rounded-full font-semibold text-base items-center gap-2 transition-colors">
                            Descargar CV
                            <Download size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                </div>
            </nav>

            {/* Modal de Login Admin */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.7)' }}
                    onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
                >
                    <div className="relative w-full max-w-md mx-4 bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 shadow-2xl"
                        style={{ boxShadow: '0 0 60px rgba(255,92,0,0.15), 0 25px 50px rgba(0,0,0,0.6)' }}>

                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-[#FF5C00] text-xs font-mono uppercase tracking-widest mb-1">Acceso restringido</p>
                                <h2 className="text-white text-2xl font-black tracking-tight">Panel Admin</h2>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Separador naranja */}
                        <div className="h-px bg-gradient-to-r from-[#FF5C00] via-[#FF5C00]/50 to-transparent mb-8" />

                        {/* Form */}
                        <form onSubmit={handleLogin} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@enzofernandez.dev"
                                    required
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 outline-none focus:border-[#FF5C00]/60 focus:bg-white/8 transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-400 text-xs font-mono uppercase tracking-wider">Contraseña</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 outline-none focus:border-[#FF5C00]/60 focus:bg-white/8 transition-all"
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-xs font-mono text-center -mt-1">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 bg-[#FF5C00] hover:bg-[#e05200] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                <LogIn size={15} strokeWidth={2.5} />
                                {loading ? 'Ingresando...' : 'Ingresar al panel'}
                            </button>
                        </form>

                        {/* Footer hint */}
                        <p className="text-center text-gray-600 text-xs mt-6 font-mono">
                            {'// solo vos sabés que esto existe'}
                        </p>
                    </div>
                </div>
            )}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#0d0d0d] border border-[#FF5C00]/40 text-white text-sm font-mono px-5 py-3 rounded-full shadow-2xl"
                    style={{ boxShadow: '0 0 30px rgba(255,92,0,0.2)' }}>
                    <span className="text-[#FF5C00] mr-2">✓</span>
                    Modo admin activado
                </div>
            )}
        </>
    );
}