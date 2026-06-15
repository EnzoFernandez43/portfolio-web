'use client';

import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail, MapPin, Clock, Send, Zap, Pencil, X, CheckCircle, Paperclip } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { updateContacto } from '@/actions/contacto';
import { createPortal } from 'react-dom';

const INFO_ITEM_MAX = 50;
const LIMITS = { nombre: 60, email: 100, asunto: 80, mensaje: 1000 };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormKey = keyof typeof LIMITS;

export default function ContactoSection() {
  const { isAdmin } = useAuth();
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [touched, setTouched] = useState({ nombre: false, email: false, asunto: false, mensaje: false });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');

  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivoError, setArchivoError] = useState('');

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setArchivoError('Solo PDF, Word o imagen (JPG/PNG/WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setArchivoError('Máximo 5MB');
      return;
    }
    setArchivoError('');
    setArchivo(file);
  };

  const errors = {
    nombre: form.nombre.length < 2 ? 'Mínimo 2 caracteres' : '',
    email: !emailRegex.test(form.email) ? 'Email inválido' : '',
    asunto: form.asunto.length < 2 ? 'Completá el asunto' : '',
    mensaje: form.mensaje.length < 10 ? 'Mínimo 10 caracteres' : '',
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const setField = (key: FormKey, value: string) => {
    if (value.length > LIMITS[key]) return;
    setForm(f => ({ ...f, [key]: value }));
  };

  const handleSubmit = async () => {
    setTouched({ nombre: true, email: true, asunto: true, mensaje: true });
    if (hasErrors || archivoError) return;
    setSending(true);
    setSendError('');

    let attachmentData: { name: string; data: string; type: string } | null = null;
    if (archivo) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(archivo);
      });
      attachmentData = { name: archivo.name, data: base64, type: archivo.type };
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, attachment: attachmentData }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
      setForm({ nombre: '', email: '', asunto: '', mensaje: '' });
      setTouched({ nombre: false, email: false, asunto: false, mensaje: false });
      setArchivo(null);
    } catch {
      setSendError('Hubo un error al enviar. Intentá de nuevo.');
    }
    setSending(false);
  };

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
      setInfoItems(infoItems.map((item, idx) =>
        idx === editingItem ? { ...item, value: editValue } : item
      ));
      await updateContacto(itemToUpdate.id, editValue);
    }
    setSaving(false);
    setEditingItem(null);
  };

  const inputClass = (key: FormKey) =>
    `w-full bg-[#13141a] border rounded-lg px-4 py-2.5 text-gray-300 text-sm placeholder-gray-600 focus:outline-none transition-colors ${touched[key] && errors[key] ? 'border-red-500/60 focus:border-red-500' : 'border-[#1f2026] focus:border-[#FF5C00]'
    }`;

  return (
    <section className="min-h-screen pt-[112px] pb-32 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* COLUMNA IZQUIERDA */}
        <div>
          <h1 className="text-4xl min-[400px]:text-5xl sm:text-6xl font-black uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
            <span className="text-white">HABLEMOS</span><br />
            <span className="text-[#FF5C00]">DE TU PROYECTO</span>
          </h1>
          <div className="w-12 h-1 bg-[#FF5C00] mt-4 mb-6" />
          <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-sm" style={{ fontFamily: 'var(--font-barlow)' }}>
            ¿Tienes una idea, proyecto o simplemente quieres saludar? Estoy siempre abierto a nuevas oportunidades y colaboraciones emocionantes.
          </p>

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
          <div className="bg-[#0c0d11] border border-[#1f2026] rounded-2xl p-5 sm:p-8">
            <span className="text-[#FF5C00] font-black text-xl">{`</>`}</span>
            <h2 className="text-white font-bold text-xl mt-2">Envíame un mensaje</h2>
            <p className="text-gray-400 text-sm mb-6">Completa el formulario y me pondré en contacto contigo.</p>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium block mb-1">Nombre</label>
                  <input type="text" value={form.nombre}
                    onChange={e => setField('nombre', e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, nombre: true }))}
                    placeholder="Tu nombre completo"
                    className={inputClass('nombre')}
                  />
                  {touched.nombre && errors.nombre && (
                    <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>
                  )}
                </div>
                <div>
                  <label className="text-white text-sm font-medium block mb-1">Email</label>
                  <input type="email" value={form.email}
                    onChange={e => setField('email', e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, email: true }))}
                    placeholder="tu@email.com"
                    className={inputClass('email')}
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-medium block mb-1">Asunto</label>
                <input type="text" value={form.asunto}
                  onChange={e => setField('asunto', e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, asunto: true }))}
                  placeholder="¿De qué se trata?"
                  className={inputClass('asunto')}
                />
                <div className="flex justify-between mt-1">
                  {touched.asunto && errors.asunto
                    ? <p className="text-red-400 text-xs">{errors.asunto}</p>
                    : <span />}
                  <span className={`text-xs font-mono ${form.asunto.length >= LIMITS.asunto ? 'text-red-400' : 'text-gray-600'}`}>
                    {form.asunto.length}/{LIMITS.asunto}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-medium block mb-1">Mensaje</label>
                <textarea value={form.mensaje}
                  onChange={e => setField('mensaje', e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, mensaje: true }))}
                  placeholder="Cuéntame sobre tu proyecto, idea o cómo puedo ayudarte..."
                  rows={5}
                  className={`${inputClass('mensaje')} resize-none`}
                />
                <div className="flex justify-between mt-1">
                  {touched.mensaje && errors.mensaje
                    ? <p className="text-red-400 text-xs">{errors.mensaje}</p>
                    : <span />}
                  <span className={`text-xs font-mono ${form.mensaje.length >= LIMITS.mensaje ? 'text-red-400' : 'text-gray-600'}`}>
                    {form.mensaje.length}/{LIMITS.mensaje}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-medium block mb-1">
                  Adjunto{' '}
                  <span className="ml-1 text-[10px] font-mono text-[#FF5C00] border border-[#FF5C00]/40 bg-[#FF5C00]/10 px-1.5 py-0.5 rounded-full">opcional</span>
                </label>
                <label className="flex items-center gap-3 w-full bg-[#13141a] border border-dashed border-[#1f2026] hover:border-[#FF5C00]/50 rounded-lg px-4 py-3 cursor-pointer transition-colors group">
                  <Paperclip size={16} className="text-gray-500 group-hover:text-[#FF5C00] transition-colors shrink-0" />
                  <span className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors truncate">
                    {archivo ? archivo.name : 'PDF, Word o imagen — máx 5MB'}
                  </span>
                  {archivo && (
                    <button type="button" onClick={(e) => { e.preventDefault(); setArchivo(null); }}
                      className="ml-auto text-gray-500 hover:text-red-400 transition-colors shrink-0">
                      <X size={14} />
                    </button>
                  )}
                  <input type="file" className="hidden" onChange={handleArchivo}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" />
                </label>
                {archivoError && <p className="text-red-400 text-xs mt-1">{archivoError}</p>}
              </div>

              {sendError && <p className="text-red-400 text-xs font-mono">{sendError}</p>}

              <button onClick={handleSubmit} disabled={sending}
                className="bg-[#FF5C00] hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition-all w-full sm:w-fit justify-center">
                {sending ? 'Enviando...' : 'Enviar mensaje'} <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal edición admin */}
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
            <textarea value={editValue}
              onChange={e => e.target.value.length <= INFO_ITEM_MAX && setEditValue(e.target.value)}
              rows={3} autoFocus
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

      {/* Modal éxito */}
      {sent && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSent(false)}>
          <div className="bg-[#0c0d11] border border-[#1f2026] rounded-2xl p-8 w-80 text-center"
            style={{ boxShadow: '0 0 60px rgba(255,92,0,0.15)' }}
            onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full border border-[#FF5C00]/40 bg-[#FF5C00]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-[#FF5C00]" />
            </div>
            <p className="text-[#FF5C00] text-xs font-mono uppercase tracking-widest mb-2">Enviado</p>
            <h3 className="text-white font-black text-xl mb-2">¡Mensaje recibido!</h3>
            <p className="text-gray-400 text-sm mb-6">Te respondo en menos de 24 horas.</p>
            <button onClick={() => setSent(false)}
              className="w-full bg-[#FF5C00] hover:bg-[#e05200] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
              Cerrar
            </button>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}