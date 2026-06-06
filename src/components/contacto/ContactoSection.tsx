'use client';

import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail, MapPin, Clock, Send, Zap, Pencil, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { updateContacto } from '@/actions/contacto';

const INFO_ITEM_MAX = 50;

export default function ContactoSection() {
  const { isAdmin } = useAuth();
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const [infoItems, setInfoItems] = useState([
    { id: 'email', icon: <Mail size={18} />, label: 'Email', value: 'enzofernandez.dev@gmail.com' },
    { id: 'ubicacion', icon: <MapPin size={18} />, label: 'Ubicación', value: 'Buenos Aires, Argentina' },
    { id: 'disponibilidad', icon: <Clock size={18} />, label: 'Disponibilidad', value: 'Lunes a Viernes, 9:00 - 18:00' },
    { id: 'respuesta', icon: <Send size={18} />, label: 'Respuesta', value: 'En menos de 24 horas' },
  ]);

  const openEdit = (index: number, value: string) => {
    setEditingItem(index);
    setEditValue(value);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editingItem !== null) {
      const itemToUpdate = infoItems[editingItem];
      const updatedInfoItems = infoItems.map((item, idx) =>
        idx === editingItem ? { ...item, value: editValue } : item
      );
      setInfoItems(updatedInfoItems);
      await updateContacto(itemToUpdate.id, editValue);
    }
    setSaving(false);
    setEditingItem(null);
  };

  return (
    <section className="min-h-screen pt-[112px] pb-16 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* COLUMNA IZQUIERDA */}
        <div>
          <h1 className="text-6xl font-black uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
            <span className="text-white">HABLEMOS</span><br />
            <span className="text-[#FF5C00]">DE TU PROYECTO</span>
          </h1>
          <div className="w-12 h-1 bg-[#FF5C00] mt-4 mb-6" />
          <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-sm" style={{ fontFamily: 'var(--font-barlow)' }}>
            ¿Tienes una idea, proyecto o simplemente quieres saludar? Estoy siempre abierto a nuevas oportunidades y colaboraciones emocionantes.
          </p>

          {/* Info items */}
          <div className="flex flex-col gap-5 mb-12">
            {infoItems.map((item, index) => (
              <div key={item.label} className="relative flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg border border-[#FF5C00] flex items-center justify-center text-[#FF5C00] shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.label}</p>
                  <p className="text-gray-400 text-sm">{item.value}</p>
                </div>
                {isAdmin && (
                  <button onClick={() => openEdit(index, item.value)}
                    className="ml-auto opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                    <Pencil size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Redes */}
          <div>
            <p className="text-white font-bold mb-1">Conectemos en redes</p>
            <p className="text-gray-400 text-sm mb-4">Sígueme en mis redes para ver más de mi trabajo</p>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all">
                <FaGithub size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="flex flex-col gap-4">

          {/* Formulario */}
          <div className="bg-[#0c0d11] border border-[#1f2026] rounded-2xl p-8">
            <span className="text-[#FF5C00] font-black text-xl">{`</>`}</span>
            <h2 className="text-white font-bold text-xl mt-2">Envíame un mensaje</h2>
            <p className="text-gray-400 text-sm mb-6">Completa el formulario y me pondré en contacto contigo.</p>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium block mb-1">Nombre</label>
                  <input
                    type="text"
                    placeholder="Tu nombre completo"
                    className="w-full bg-[#13141a] border border-[#1f2026] rounded-lg px-4 py-2.5 text-gray-300 text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF5C00] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="w-full bg-[#13141a] border border-[#1f2026] rounded-lg px-4 py-2.5 text-gray-300 text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF5C00] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-medium block mb-1">Asunto</label>
                <input
                  type="text"
                  placeholder="¿De qué se trata?"
                  className="w-full bg-[#13141a] border border-[#1f2026] rounded-lg px-4 py-2.5 text-gray-300 text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF5C00] transition-colors"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium block mb-1">Mensaje</label>
                <textarea
                  placeholder="Cuéntame sobre tu proyecto, idea o cómo puedo ayudarte..."
                  rows={5}
                  className="w-full bg-[#13141a] border border-[#1f2026] rounded-lg px-4 py-2.5 text-gray-300 text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF5C00] transition-colors resize-none"
                />
              </div>

              <button className="bg-[#FF5C00] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all w-fit">
                Enviar mensaje <Send size={16} />
              </button>
            </div>
          </div>

          {/* Card por qué trabajar conmigo */}
          <div className="bg-[#0c0d11] border border-[#1f2026] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} className="text-[#FF5C00]" />
              <p className="text-white font-bold">¿Por qué trabajar conmigo?</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: 'Código limpio', desc: 'Soluciones escalables y mantenibles' },
                { title: 'Comunicación clara', desc: 'Te mantengo al tanto en cada paso' },
                { title: 'Enfoque en resultados', desc: 'Tu éxito es mi prioridad' },
              ].map(({ title, desc }) => (
                <div key={title}>
                  <p className="text-[#FF5C00] font-semibold text-sm mb-1">{title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modal edición — solo admin */}
      {editingItem !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setEditingItem(null)}>
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-7 w-full max-w-lg mx-4"
            style={{ boxShadow: '0 0 60px rgba(255,92,0,0.1)' }}>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#FF5C00] text-xs font-mono uppercase tracking-widest mb-1">Modo admin</p>
                <h2 className="text-white font-black">Editar {infoItems[editingItem].label}</h2>
              </div>
              <button onClick={() => setEditingItem(null)}
                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <X size={13} />
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-[#FF5C00] via-[#FF5C00]/40 to-transparent mb-5" />

            <textarea
              value={editValue}
              onChange={e => e.target.value.length <= INFO_ITEM_MAX && setEditValue(e.target.value)}
              rows={3}
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 text-sm font-mono outline-none focus:border-[#FF5C00]/60 transition-all resize-none"
            />
            <div className="flex justify-end mt-1 mb-4">
              <span className={`text-xs font-mono ${editValue.length >= INFO_ITEM_MAX ? 'text-red-400' : 'text-gray-600'}`}>
                {editValue.length}/{INFO_ITEM_MAX}
              </span>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditingItem(null)}
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