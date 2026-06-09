'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, FileText, Save, Rocket, Image as ImageIcon, Plus, X, Bold, Italic, Underline, List, ListOrdered, Link, Code, Quote } from 'lucide-react';
import { createProyecto } from '@/actions/proyectos';
import { getTechIcon } from '@/lib/techIcons';

const CATEGORIAS = ['Web Apps', 'APIs', 'Full-Stack', 'Frontend', 'Backend', 'Mobile', 'Otros'];
const TECNOLOGIAS = ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'MongoDB',
  'PostgreSQL', 'Express', 'Firebase', 'Tailwind', 'Socket.io', 'HTML', 'CSS',
  'Prisma', 'Docker', 'Java', 'Spring Boot', 'SQL', 'AWS'];

const EMPTY_FORM = {
  titulo: '',
  subtitulo: '',
  descripcion: '',
  imagen_url: '',
  imagenes_muestra: [] as string[],
  github_url: '',
  demo_url: '',
  categoria: [] as string[],
  tecnologias: [] as string[],
  destacado: false,
  orden: 0,
};

type FormState = typeof EMPTY_FORM;

export default function NuevoProyectoForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const portadaInputRef = useRef<HTMLInputElement>(null);
  const muestraInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: data }
    );
    const json = await res.json();
    return json.secure_url as string;
  };

  const handlePortadaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadToCloudinary(file);
    setForm(f => ({ ...f, imagen_url: url }));
    setUploading(false);
  };

  const handleMuestraUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    const url = await uploadToCloudinary(file);
    setForm(f => {
      const imgs = [...f.imagenes_muestra];
      imgs[idx] = url;
      return { ...f, imagenes_muestra: imgs };
    });
    setUploadingIdx(null);
  };

  const removeMuestra = (idx: number) => {
    setForm(f => ({ ...f, imagenes_muestra: f.imagenes_muestra.filter((_, i) => i !== idx) }));
  };

  const toggleArray = (key: 'tecnologias' | 'categoria', val: string) =>
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }));

  const execCmd = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    updateWordCount();
  };

  const updateWordCount = useCallback(() => {
    const text = editorRef.current?.innerText ?? '';
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  }, []);

  const getDescripcion = () => editorRef.current?.innerHTML ?? '';

  const handleSave = async (publish: boolean) => {
    const setter = publish ? setPublishing : setSaving;
    setter(true);
    try {
      await createProyecto({
        ...form,
        descripcion: getDescripcion(),
        destacado: publish ? form.destacado : false,
      });
      router.push('/proyectos');
    } finally {
      setter(false);
    }
  };

  const muestraSlots = [...form.imagenes_muestra, ...Array(Math.max(0, 6 - form.imagenes_muestra.length)).fill('')].slice(0, 6);

  return (
    <div className="min-h-screen bg-[#050507] text-white pt-[72px]" style={{ fontFamily: 'var(--font-barlow)' }}>

      {/* Top bar */}
      <div className="sticky top-[72px] z-40 border-b border-[#1a1b22] bg-[#050507]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push('/proyectos')}
            className="flex items-center gap-2 text-[#FF5C00] text-sm hover:text-orange-400 transition-colors"
          >
            <ArrowLeft size={14} /> Volver a proyectos
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || publishing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#FF5C00]/40 text-[#FF5C00] text-sm font-medium hover:bg-[#FF5C00]/10 transition-all disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? 'Guardando...' : 'Guardar borrador'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || publishing || !form.titulo}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#FF5C00] hover:bg-orange-600 text-white text-sm font-semibold transition-all disabled:opacity-50"
            >
              <Rocket size={14} />
              {publishing ? 'Publicando...' : 'Publicar proyecto →'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Agregar nuevo proyecto</h1>
          <p className="text-gray-500 text-sm mt-1">
            Completa la información de tu proyecto. Los campos marcados con <span className="text-[#FF5C00]">*</span> son obligatorios.
          </p>
        </div>

        <div className="flex gap-8">

          {/* Sidebar steps */}
          <div className="hidden lg:flex flex-col gap-0 w-36 shrink-0 pt-1">
            {[
              { n: '1', label: 'Información principal' },
              { n: '2', label: 'Contenido del proyecto' },
            ].map(({ n, label }) => (
              <div key={n} className="flex flex-col items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FF5C00] flex items-center justify-center text-white text-xs font-black shrink-0">
                    {n}
                  </div>
                  <span className="text-gray-400 text-xs leading-tight">{label}</span>
                </div>
                {n === '1' && <div className="w-px h-64 bg-[#1a1b22] ml-[-76px] mt-2 mb-2" />}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col gap-6">

            {/* === PREVIEW CARD === */}
            <div className="bg-[#0c0d11] border border-[#1a1b22] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={16} className="text-[#FF5C00]" />
                <span className="text-white font-bold text-sm">Vista previa</span>
              </div>
              <div className="bg-[#080809] border border-[#1a1b22] rounded-xl p-5 flex gap-5 items-start">
                {/* Preview image */}
                <div className="w-52 h-32 rounded-lg bg-[#111216] border border-[#1a1b22] overflow-hidden shrink-0 flex items-center justify-center">
                  {form.imagen_url
                    ? <img src={form.imagen_url} alt="" className="w-full h-full object-cover" />
                    : <ImageIcon size={28} className="text-white/10" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg mb-1 truncate">
                    {form.titulo || 'Título del proyecto'}
                  </h3>
                  <p className="text-[#FF5C00] text-sm mb-3 line-clamp-2 leading-relaxed">
                    {form.subtitulo || 'Descripción corta del proyecto que resuma su propósito en una línea o dos.'}
                  </p>
                  {/* Tech icons preview */}
                  {form.tecnologias.length > 0 && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {form.tecnologias.slice(0, 6).map(t => (
                        <span key={t} className="text-white/70 [&>svg]:w-5 [&>svg]:h-5" title={t}>
                          {getTechIcon(t)}
                        </span>
                      ))}
                    </div>
                  )}
                  {form.categoria.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {form.categoria.map(c => (
                        <span key={c} className="text-xs border border-[#FF5C00]/30 text-gray-400 px-3 py-0.5 rounded-full">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  {form.categoria.length === 0 && (
                    <span className="text-xs border border-white/10 text-gray-600 px-3 py-0.5 rounded-full">
                      Categoría del proyecto
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* === BLOQUE 1: INFORMACIÓN BÁSICA === */}
            <div className="bg-[#0c0d11] border border-[#1a1b22] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText size={16} className="text-[#FF5C00]" />
                <span className="text-white font-bold text-sm">Información básica</span>
              </div>
              <div className="flex flex-col gap-5">

                <Field label="Título del proyecto" required>
                  <input
                    type="text"
                    placeholder="Ej: TaskFlow"
                    value={form.titulo}
                    onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                    className="w-full bg-[#080809] border border-[#1a1b22] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5C00]/50 transition-all placeholder:text-gray-600"
                  />
                </Field>

                <Field label="Descripción corta" required>
                  <div className="relative">
                    <textarea
                      rows={2}
                      maxLength={120}
                      placeholder="Una breve descripción de tu proyecto en una línea"
                      value={form.subtitulo}
                      onChange={e => setForm(f => ({ ...f, subtitulo: e.target.value }))}
                      className="w-full bg-[#080809] border border-[#1a1b22] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5C00]/50 transition-all resize-none placeholder:text-gray-600"
                    />
                    <span className="absolute bottom-2 right-3 text-xs text-gray-600 font-mono">
                      {form.subtitulo.length}/120
                    </span>
                  </div>
                </Field>

                <Field label="Imagen de portada" required>
                  <div
                    onClick={() => portadaInputRef.current?.click()}
                    className="w-full bg-[#080809] border-2 border-dashed border-[#1a1b22] rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#FF5C00]/30 hover:bg-[#FF5C00]/5 transition-all group min-h-[120px]"
                  >
                    {form.imagen_url
                      ? <img src={form.imagen_url} alt="" className="max-h-32 rounded-lg object-contain" />
                      : <>
                          <ImageIcon size={28} className="text-white/20 group-hover:text-[#FF5C00]/40 transition-colors" />
                          <p className="text-gray-500 text-sm text-center">
                            {uploading ? 'Subiendo...' : 'Arrastra una imagen aquí o haz clic para seleccionar'}
                          </p>
                          <p className="text-gray-600 text-xs">Recomendado: 1200x630px, máximo 5MB</p>
                          <button type="button" className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-400 transition-all">
                            Seleccionar imagen
                          </button>
                        </>
                    }
                  </div>
                  <input ref={portadaInputRef} type="file" accept="image/*" onChange={handlePortadaUpload} className="hidden" />
                </Field>

                {/* Imágenes de muestra */}
                <div>
                  <label className="block text-sm text-gray-300 font-medium mb-2">Imágenes de muestra</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {muestraSlots.map((url, idx) => (
                      <div key={idx} className="relative aspect-video">
                        {url
                          ? <>
                              <img src={url} alt="" className="w-full h-full object-cover rounded-lg border border-[#1a1b22]" />
                              <button
                                onClick={() => removeMuestra(idx)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black border border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                              >
                                <X size={10} />
                              </button>
                            </>
                          : <label className="w-full h-full flex flex-col items-center justify-center bg-[#080809] border border-dashed border-[#1a1b22] rounded-lg cursor-pointer hover:border-[#FF5C00]/30 transition-all gap-1">
                              {uploadingIdx === idx
                                ? <span className="text-[10px] text-gray-500">...</span>
                                : <>
                                    <Plus size={14} className="text-white/20" />
                                    <span className="text-[10px] text-gray-600">Agregar</span>
                                  </>
                              }
                              <input
                                type="file" accept="image/*"
                                onChange={e => handleMuestraUpload(e, idx)}
                                className="hidden"
                              />
                            </label>
                        }
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs mt-2">Máximo 6 imágenes. Formatos: JPG, PNG, WebP. Máx 5MB cada una.</p>
                </div>

                <Field label="Categoría del proyecto" required>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIAS.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleArray('categoria', cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          form.categoria.includes(cat)
                            ? 'bg-[#FF5C00] border-[#FF5C00] text-white'
                            : 'border-[#1a1b22] text-gray-400 hover:border-[#FF5C00]/40 hover:text-gray-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="GitHub URL">
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={form.github_url}
                      onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))}
                      className="w-full bg-[#080809] border border-[#1a1b22] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5C00]/50 transition-all placeholder:text-gray-600"
                    />
                  </Field>
                  <Field label="Demo URL">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.demo_url}
                      onChange={e => setForm(f => ({ ...f, demo_url: e.target.value }))}
                      className="w-full bg-[#080809] border border-[#1a1b22] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5C00]/50 transition-all placeholder:text-gray-600"
                    />
                  </Field>
                </div>

                <Field label="Tecnologías">
                  <div className="flex flex-wrap gap-2">
                    {TECNOLOGIAS.map(tech => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleArray('tecnologias', tech)}
                        className={`px-3 py-1 rounded-full text-xs border transition-all ${
                          form.tecnologias.includes(tech)
                            ? 'border-[#FF5C00] text-white bg-[#FF5C00]/10'
                            : 'border-[#1a1b22] text-gray-400 hover:border-[#FF5C00]/30'
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </Field>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))}
                    className="accent-[#FF5C00] w-4 h-4"
                  />
                  <span className="text-gray-400 text-sm">Marcar como proyecto destacado</span>
                </label>

              </div>
            </div>

            {/* === BLOQUE 2: CONTENIDO DEL PROYECTO (rich text) === */}
            <div className="bg-[#0c0d11] border border-[#1a1b22] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={16} className="text-[#FF5C00]" />
                <span className="text-white font-bold text-sm">Contenido del proyecto</span>
              </div>
              <p className="text-gray-500 text-xs mb-5">
                Descripción detallada <span className="text-[#FF5C00]">*</span> — Cuenta tu historia, explica cómo lo construiste y qué aprendiste en el proceso.
              </p>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 border border-[#1a1b22] rounded-t-xl px-3 py-2 bg-[#080809]">
                {[
                  { icon: null, label: 'H1', cmd: 'formatBlock', val: 'h1' },
                  { icon: null, label: 'H2', cmd: 'formatBlock', val: 'h2' },
                  { icon: null, label: 'H3', cmd: 'formatBlock', val: 'h3' },
                ].map(({ label, cmd, val }) => (
                  <button key={label} type="button" onMouseDown={e => { e.preventDefault(); execCmd(cmd, val); }}
                    className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all font-mono font-bold">
                    {label}
                  </button>
                ))}
                <div className="w-px h-5 bg-[#1a1b22] mx-1 self-center" />
                {[
                  { icon: <Bold size={13} />, cmd: 'bold' },
                  { icon: <Italic size={13} />, cmd: 'italic' },
                  { icon: <Underline size={13} />, cmd: 'underline' },
                ].map(({ icon, cmd }) => (
                  <button key={cmd} type="button" onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all">
                    {icon}
                  </button>
                ))}
                <div className="w-px h-5 bg-[#1a1b22] mx-1 self-center" />
                {[
                  { icon: <List size={13} />, cmd: 'insertUnorderedList' },
                  { icon: <ListOrdered size={13} />, cmd: 'insertOrderedList' },
                  { icon: <Quote size={13} />, cmd: 'formatBlock', val: 'blockquote' },
                  { icon: <Code size={13} />, cmd: 'formatBlock', val: 'pre' },
                ].map(({ icon, cmd, val }) => (
                  <button key={cmd + (val ?? '')} type="button" onMouseDown={e => { e.preventDefault(); execCmd(cmd, val); }}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all">
                    {icon}
                  </button>
                ))}
                <div className="w-px h-5 bg-[#1a1b22] mx-1 self-center" />
                <button
                  type="button"
                  onMouseDown={e => {
                    e.preventDefault();
                    const url = prompt('URL del enlace:');
                    if (url) execCmd('createLink', url);
                  }}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all"
                >
                  <Link size={13} />
                </button>
              </div>

              {/* Editor */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={updateWordCount}
                data-placeholder="Empieza a escribir la descripción de tu proyecto..."
                className="min-h-[320px] bg-[#080809] border border-t-0 border-[#1a1b22] rounded-b-xl px-5 py-4 text-gray-300 text-sm leading-relaxed outline-none focus:border-[#FF5C00]/30 transition-all
                  [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-white [&_h1]:mb-3 [&_h1]:mt-5
                  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-2 [&_h2]:mt-4
                  [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mb-2 [&_h3]:mt-3
                  [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
                  [&_li]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-[#FF5C00] [&_blockquote]:pl-4 [&_blockquote]:text-gray-400 [&_blockquote]:italic
                  [&_pre]:bg-black [&_pre]:rounded [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:text-green-400 [&_pre]:mb-3
                  [&_a]:text-[#FF5C00] [&_a]:underline
                  empty:before:content-[attr(data-placeholder)] empty:before:text-gray-600 empty:before:pointer-events-none"
              />

              <div className="flex justify-end mt-2">
                <span className="text-xs font-mono text-gray-600">PALABRAS: {wordCount}</span>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="flex justify-end gap-3 pb-10">
              <button
                onClick={() => handleSave(false)}
                disabled={saving || publishing}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#FF5C00]/40 text-[#FF5C00] text-sm font-medium hover:bg-[#FF5C00]/10 transition-all disabled:opacity-50"
              >
                <Save size={15} />
                {saving ? 'Guardando...' : 'Guardar borrador'}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving || publishing || !form.titulo}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5C00] hover:bg-orange-600 text-white text-sm font-semibold transition-all disabled:opacity-50"
              >
                <Rocket size={15} />
                {publishing ? 'Publicando...' : 'Publicar proyecto →'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-300 font-medium">
        {label}{required && <span className="text-[#FF5C00] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
