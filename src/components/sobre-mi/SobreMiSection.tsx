'use client';

import { useState } from 'react';
import { FaReact, FaNodeJs, FaDocker, FaAws } from 'react-icons/fa';
import { SiNextdotjs, SiTypescript, SiPostgresql, SiMongodb } from 'react-icons/si';
import { Calendar, MapPin, Send, CheckCircle, Star, Pencil, X, User, Coffee, Dumbbell, Lightbulb, BookOpen, Music } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updateSobreMi } from '@/actions/sobreMi';

const QUIEN_SOY_MAX = 325;
const TIEMPO_LIBRE_MAX = 120;

const INITIAL = {
    quienSoy: [
        'Soy un desarrollador full-stack enfocado en construir aplicaciones web modernas, escalables y eficientes.',
        'Disfruto transformar ideas en productos reales usando tecnologías actuales y buenas prácticas de desarrollo.',
        'Me motiva el aprendizaje constante, el trabajo en equipo y los desafíos que me sacan de mi zona de confort.',
    ],
    tiempoLibre: [
        { text: 'Me gusta entrenar y mantenerme activo' },
        { text: 'Exploro nuevas tecnologías' },
        { text: 'Leo sobre negocios y crecimiento personal' },
        { text: 'Escucho música para concentrarme' },
    ],
};

const TIEMPO_LIBRE_ICONS = [
    <Dumbbell size={15} className="text-[#FF5C00] shrink-0" />,
    <Lightbulb size={15} className="text-[#FF5C00] shrink-0" />,
    <BookOpen size={15} className="text-[#FF5C00] shrink-0" />,
    <Music size={15} className="text-[#FF5C00] shrink-0" />,
];

export default function SobreMiSection({ initialData }: { initialData: Record<string, string> }) {
    const { isAdmin } = useAuth();
    const [hovered, setHovered] = useState<number | null>(null);
    const [editingCard, setEditingCard] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [saving, setSaving] = useState(false);

    // Estado editable
    const [quienSoy, setQuienSoy] = useState(
        initialData['quien_soy']?.split('\n').filter(Boolean) ?? INITIAL.quienSoy
    );

    const [tiempoLibre, setTiempoLibre] = useState(() => {
        const items = initialData['tiempo_libre']?.split(';').map(s => s.trim()).filter(Boolean);
        return items?.map((text) => ({ text })) ?? INITIAL.tiempoLibre;
    });

    const maxLen = editingCard === 0 ? QUIEN_SOY_MAX : TIEMPO_LIBRE_MAX;

    const openEdit = (card: number, value: string) => {
        setEditingCard(card);
        setEditValue(value);
    };

    const handleSave = async () => {
        setSaving(true);
        if (editingCard === 0) {
            const partes = editValue.split('\n').filter(Boolean);
            setQuienSoy(partes.length > 0 ? partes : [editValue]);
            await updateSobreMi('quien_soy', editValue);
        }
        if (editingCard === 1) {
            const items = editValue.split(';').map(s => s.trim()).filter(Boolean);
            setTiempoLibre(items.map((text) => ({ text })));
            await updateSobreMi('tiempo_libre', editValue);
        }
        setSaving(false);
        setEditingCard(null);
    };

    const cardStyle = (i: number) => ({
        boxShadow: hovered === i
            ? '0 0 40px rgba(255,92,0,0.45), 0 0 80px rgba(255,92,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 0 0 transparent',
        border: hovered === i ? '1px solid rgba(255,92,0,0.6)' : '1px solid #1f2026',
        transition: 'box-shadow 0.4s ease, border 0.3s ease',
    });

    return (
        <section className="min-h-screen pt-95 md:pt-[112px] pb-32 px-6 max-w-6xl mx-auto flex flex-col gap-8">
            {/* BLOQUE 1 */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-8 items-start">
                <div>
                    <h1 className="text-4xl min-[400px]:text-5xl sm:text-6xl font-black uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
            <span className="text-white">ENZO</span><br />
            <span className="text-[#FF5C00]">FERNÁNDEZ</span>
          </h1>
                    <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-full md:max-w-xs" style={{ fontFamily: 'var(--font-barlow)' }}>
                        Desarrollador Full-Stack con pasión por crear soluciones digitales que generan impacto real.
                    </p>
                    <div className="flex flex-col gap-4 max-w-full md:max-w-[280px]">
                        {[
                            { icon: <Calendar size={18} />, title: '3+ años', sub: 'de experiencia' },
                            { icon: <MapPin size={18} />, title: 'Buenos Aires, Argentina', sub: 'Disponible para trabajo remoto' },
                            { icon: <Send size={18} />, title: 'Me apasiona', sub: 'Resolver problemas con código y aprender cada día algo nuevo.' },
                        ].map(({ icon, title, sub }) => (
                            <div key={title} className="flex items-start gap-4 border-b border-[#1f2026] pb-4 last:border-0">
                                <div className="w-9 h-9 rounded-lg border border-[#FF5C00] flex items-center justify-center text-[#FF5C00] shrink-0 mt-0.5">{icon}</div>
                                <div>
                                    <p className="text-white font-bold text-sm">{title}</p>
                                    <p className="text-gray-400 text-sm">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden md:block" />

                <div className="flex flex-col gap-4">
                    {/* ¿Quién soy? */}
                    <div className="relative bg-[#0c0d11] rounded-2xl p-6" style={cardStyle(0)}
                        onMouseEnter={() => setHovered(0)} onMouseLeave={() => setHovered(null)}>
                        {isAdmin && (
                            <button onClick={() => openEdit(0, quienSoy.join('\n'))}
                                className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                                <Pencil size={12} />
                            </button>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                            <User size={16} className="text-[#FF5C00]" />
                            <p className="text-white font-bold">¿Quién soy?</p>
                        </div>
                        <div className="flex flex-col gap-3 text-gray-400 text-sm leading-relaxed">
                            {quienSoy.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </div>

                    {/* Tiempo libre */}
                    <div className="relative bg-[#0c0d11] rounded-2xl p-6" style={cardStyle(1)}
                        onMouseEnter={() => setHovered(1)} onMouseLeave={() => setHovered(null)}>
                        {isAdmin && (
                            <button onClick={() => openEdit(1, tiempoLibre.map(t => t.text).join('; '))}
                                className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                                <Pencil size={12} />
                            </button>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                            <Coffee size={16} className="text-[#FF5C00]" />
                            <p className="text-white font-bold">En mi tiempo libre</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            {tiempoLibre.map(({ text }, i) => (
                                <div key={text} className="flex items-center gap-3 text-gray-400 text-sm">
                                    {TIEMPO_LIBRE_ICONS[i] ?? <span>•</span>}
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* BLOQUE 2 */}
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-4">
                <div className="relative bg-[#0c0d11] rounded-2xl p-6" style={cardStyle(2)}
                    onMouseEnter={() => setHovered(2)} onMouseLeave={() => setHovered(null)}>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-[#FF5C00] font-black">{`</>`}</span>
                        <p className="text-white font-bold">Mi stack tecnológico</p>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6">
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
                                <div className="w-8 h-8 sm:w-11 sm:h-11 [&>svg]:w-full [&>svg]:h-full">
                                    {icon}
                                </div>
                                <span className="text-gray-400 text-xs text-center">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative bg-[#0c0d11] rounded-2xl p-6" style={cardStyle(3)}
                    onMouseEnter={() => setHovered(3)} onMouseLeave={() => setHovered(null)}>
                    <div className="flex items-center gap-2 mb-4">
                        <Star size={16} className="text-[#FF5C00]" fill="#FF5C00" />
                        <p className="text-white font-bold">Mis valores</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {['Código limpio y escalable', 'Comunicación clara', 'Compromiso y responsabilidad', 'Mejora continua'].map(v => (
                            <div key={v} className="flex items-center gap-2 text-gray-400 text-sm">
                                <CheckCircle size={16} className="text-[#FF5C00] shrink-0" />{v}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative bg-[#0c0d11] rounded-2xl p-6 grid grid-cols-2 gap-4 content-center" style={cardStyle(4)}
                    onMouseEnter={() => setHovered(4)} onMouseLeave={() => setHovered(null)}>
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
            <div className="mt-16 relative border border-[#1f2026] rounded-2xl p-8 md:p-10 overflow-hidden bg-[#0c0d11]/60 flex flex-col md:flex-row items-center md:justify-between gap-6 text-center md:text-left">
                {/* Icono decorativo de fondo */}
                <span className="absolute -right-4 -top-6 text-[#FF5C00]/10 text-[10rem] font-black leading-none pointer-events-none select-none">
                    {`</>`}
                </span>

                <div className="relative z-10 flex flex-col items-center md:items-start gap-2">
                    <span className="text-[#FF5C00] text-2xl font-black">{`</>`}</span>
                    <p className="text-white font-bold text-xl md:text-lg">¿Tienes una idea o proyecto en mente?</p>
                    <p className="text-gray-400 text-sm max-w-sm">Estoy disponible para nuevos desafíos y colaboraciones.</p>
                </div>

                <a href="/contacto"
                    className="relative z-10 bg-[#FF5C00] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all shrink-0 w-full sm:w-auto justify-center">
                    Hablemos →
                </a>
            </div>

            {/* Modal editor */}
            {editingCard !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={e => e.target === e.currentTarget && setEditingCard(null)}>
                    <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-7 w-full max-w-lg mx-4"
                        style={{ boxShadow: '0 0 60px rgba(255,92,0,0.1)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[#FF5C00] text-xs font-mono uppercase tracking-widest mb-1">Modo admin</p>
                                <h2 className="text-white font-black">Editar contenido</h2>
                            </div>
                            <button onClick={() => setEditingCard(null)}
                                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                                <X size={13} />
                            </button>
                        </div>
                        <div className="h-px bg-gradient-to-r from-[#FF5C00] via-[#FF5C00]/40 to-transparent mb-5" />

                        <p className="text-gray-500 text-xs font-mono mb-2">
                            {editingCard === 1 ? '// Separar items con punto y coma ;' : '// Cada línea es un párrafo'}
                        </p>

                        <textarea
                            value={editValue}
                            onChange={e => e.target.value.length <= maxLen && setEditValue(e.target.value)}
                            rows={6}
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 text-sm font-mono outline-none focus:border-[#FF5C00]/60 transition-all resize-none"
                        />
                        <div className="flex justify-end mt-1 mb-4">
                            <span className={`text-xs font-mono ${editValue.length >= maxLen ? 'text-red-400' : 'text-gray-600'}`}>
                                {editValue.length}/{maxLen}
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setEditingCard(null)}
                                className="flex-1 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white py-2.5 rounded-xl text-sm font-semibold transition-all">
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-1 bg-[#FF5C00] hover:bg-[#e05200] disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
