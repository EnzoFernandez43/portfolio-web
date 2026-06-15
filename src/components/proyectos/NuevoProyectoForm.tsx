'use client';
 
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, FileText, Save, Rocket, Image as ImageIcon, Plus, X } from 'lucide-react';
import { createProyecto, updateProyecto, Proyecto } from '@/actions/proyectos';
import { getTechIcon } from '@/lib/techIcons';
import ProyectoEditor, { blocksToHTML, Block } from './ProyectoEditor';
import MuestraGalleryUpload from './ImageGalleryUpload';
 
const CATEGORIAS = ['Web Apps', 'APIs', 'Full-Stack', 'Frontend', 'Backend', 'Mobile', 'Otros'];
const TECNOLOGIAS = ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'MongoDB',
  'PostgreSQL', 'Express', 'Firebase', 'Tailwind', 'Socket.io', 'HTML', 'CSS',
  'Prisma', 'Docker', 'Java', 'Spring Boot', 'SQL', 'AWS'];
 
const EMPTY_FORM = {
  titulo: '',
  subtitulo: '',
  imagen_url: '',
  imagenes_muestra: [] as string[],
  github_url: '',
  demo_url: '',
  categoria: [] as string[],
  tecnologias: [] as string[],
  destacado: false,
  orden: 0,
};
 
export default function NuevoProyectoForm({ proyecto }: { proyecto?: Proyecto & { imagenes_muestra?: string[] } }) {
  const router = useRouter();
  const [form, setForm] = useState(proyecto ? {
    titulo: proyecto.titulo ?? '',
    subtitulo: proyecto.subtitulo ?? '',
    imagen_url: proyecto.imagen_url ?? '',
    imagenes_muestra: proyecto.imagenes_muestra ?? [],
    github_url: proyecto.github_url ?? '',
    demo_url: proyecto.demo_url ?? '',
    categoria: proyecto.categoria ?? [],
    tecnologias: proyecto.tecnologias ?? [],
    destacado: proyecto.destacado ?? false,
    orden: proyecto.orden ?? 0,
  } : EMPTY_FORM);
  const [blocks, setBlocks] = useState<Block[]>(() => {
    if (proyecto?.descripcion) {
      // Parsear el HTML guardado de vuelta a blocks simples
      return [{ id: 'init', type: 'paragraph' as const, html: proyecto.descripcion, align: 'left' as const }];
    }
    return [{ id: 'init', type: 'paragraph' as const, html: '', align: 'left' as const }];
  });
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Reemplazado para manejar la subida inmediata
  const [muestraFiles, setMuestraFiles] = useState<File[]>([]);
  const [muestraUrls, setMuestraUrls] = useState<string[]>(proyecto?.imagenes_muestra ?? []);
  const [uploadingMuestra, setUploadingMuestra] = useState(false);
  const [muestraError, setMuestraError] = useState('');
  
  const portadaInputRef = useRef<HTMLInputElement>(null);
 
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
    e.target.value = ''; // reset
  };
 
  const toggleArray = (key: 'tecnologias' | 'categoria', val: string) =>
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }));

  const handleMuestraChange = async (newFiles: File[]) => {
    setMuestraFiles(newFiles);
    
    // Subir solo los archivos nuevos (que no tenían URL previa)
    const prevCount = muestraUrls.length;
    if (newFiles.length > prevCount) {
      setUploadingMuestra(true);
      const toUpload = newFiles.slice(prevCount);
      const newUrls = await Promise.all(toUpload.map(f => uploadToCloudinary(f)));
      setMuestraUrls(prev => [...prev, ...newUrls]);
      setUploadingMuestra(false);
    } else {
      // El usuario eliminó archivos — sincronizar URLs
      setMuestraUrls(prev => prev.slice(0, newFiles.length));
    }
  };
 
  const handleSave = async (publish: boolean) => {
    const setter = publish ? setPublishing : setSaving;
    setter(true);
    try {
      const payload = {
        ...form,
        imagenes_muestra: muestraUrls,
        descripcion: blocksToHTML(blocks),
        destacado: publish ? form.destacado : false,
      };
      if (proyecto) {
        await updateProyecto(proyecto.id, payload);
      } else {
        await createProyecto(payload);
      }
      router.push('/proyectos');
    } finally {
      setter(false);
    }
  };

  const isBlocking = uploadingMuestra || saving || publishing;
 
  return (
    <div className="min-h-screen bg-[#050507] text-white pt-0" style={{ fontFamily: 'var(--font-barlow)' }}>
      {isBlocking && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#FF5C00] border-t-transparent animate-spin" />
          <p className="text-white text-sm font-medium">
            {uploadingMuestra ? 'Subiendo imágenes...' : publishing ? 'Publicando proyecto...' : 'Guardando...'}
          </p>
        </div>
      )}
 
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-40 border-b border-[#1a1b22] bg-[#050507]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <button
            onClick={() => router.push('/proyectos')}
            className="flex items-center gap-1.5 text-[#FF5C00] text-xs shrink-0 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft size={13} /> Volver
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || publishing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#FF5C00]/40 text-[#FF5C00] text-xs font-medium hover:bg-[#FF5C00]/10 transition-all disabled:opacity-50"
            >
              <Save size={13} />
              {saving ? 'Guardando...' : 'Borrador'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || publishing || !form.titulo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FF5C00] hover:bg-orange-600 text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Rocket size={13} />
              {publishing ? 'Publicando...' : 'Publicar →'}
            </button>
          </div>
        </div>
      </div>
 
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">
            {proyecto ? 'Editar proyecto' : 'Agregar nuevo proyecto'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {proyecto ? 'Modificá los campos que quieras actualizar.' : <>Campos marcados con <span className="text-[#FF5C00]">*</span> son obligatorios.</>}
          </p>
        </div>
 
        <div className="flex gap-8">
 
          {/* ── Sidebar steps ── */}
          <div className="hidden lg:flex flex-col gap-0 w-36 shrink-0 pt-1">
            {[
              { n: '1', label: 'Información principal' },
              { n: '2', label: 'Contenido del proyecto' },
            ].map(({ n, label }) => (
              <div key={n} className="flex flex-col items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FF5C00] flex items-center justify-center text-white text-xs font-black shrink-0">{n}</div>
                  <span className="text-gray-400 text-xs leading-tight">{label}</span>
                </div>
                {n === '1' && <div className="w-px h-64 bg-[#1a1b22] ml-[-76px] mt-2 mb-2" />}
              </div>
            ))}
          </div>
 
          {/* ── Main content ── */}
          <div className="flex-1 flex flex-col gap-6">
 
            {/* Preview card */}
            <div className="bg-[#0c0d11] border border-[#1a1b22] rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={16} className="text-[#FF5C00]" />
                <span className="text-white font-bold text-sm">Vista previa</span>
              </div>
              <div className="bg-[#080809] border border-[#1a1b22] rounded-xl overflow-hidden max-w-[280px]">
                <div className="w-full h-56 sm:h-64 bg-[#111216] flex items-center justify-center overflow-hidden">
                  {form.imagen_url
                    ? <img src={form.imagen_url} alt="" className="w-full h-full object-cover" />
                    : <ImageIcon size={28} className="text-white/10" />
                  }
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-base mb-1 truncate">{form.titulo || 'Título del proyecto'}</h3>
                  <p className="text-[#FF5C00] text-sm mb-3 line-clamp-2 leading-relaxed">
                    {form.subtitulo || 'Descripción corta del proyecto...'}
                  </p>
                  {form.tecnologias.length > 0 && (
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {form.tecnologias.slice(0, 6).map(t => (
                        <span key={t} className="text-white/70 [&>svg]:w-5 [&>svg]:h-5" title={t}>
                          {getTechIcon(t)}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {form.categoria.length > 0
                      ? form.categoria.map(c => (
                          <span key={c} className="text-xs border border-[#FF5C00]/30 text-gray-400 px-3 py-0.5 rounded-full">{c}</span>
                        ))
                      : <span className="text-xs border border-white/10 text-gray-600 px-3 py-0.5 rounded-full">Categoría</span>
                    }
                  </div>
                </div>
              </div>
            </div>
 
            {/* Información básica */}
            <div className="bg-[#0c0d11] border border-[#1a1b22] rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText size={16} className="text-[#FF5C00]" />
                <span className="text-white font-bold text-sm">Información básica</span>
              </div>
              <div className="flex flex-col gap-5">
 
                <Field label="Título del proyecto" required>
                  <input
                    type="text" placeholder="Ej: TaskFlow"
                    value={form.titulo}
                    onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                    className="w-full bg-[#080809] border border-[#1a1b22] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5C00]/50 transition-all placeholder:text-gray-600"
                  />
                </Field>
 
                <Field label="Descripción corta" required>
                  <div className="relative">
                    <textarea
                      rows={2} maxLength={120}
                      placeholder="Una breve descripción de tu proyecto en una línea"
                      value={form.subtitulo}
                      onChange={e => setForm(f => ({ ...f, subtitulo: e.target.value }))}
                      className="w-full bg-[#080809] border border-[#1a1b22] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5C00]/50 transition-all resize-none placeholder:text-gray-600"
                    />
                    <span className="absolute bottom-2 right-3 text-xs text-gray-600 font-mono">{form.subtitulo.length}/120</span>
                  </div>
                </Field>
 
                <Field label="Imagen de portada" required>
                  <div className="relative">
                    <div
                      onClick={() => portadaInputRef.current?.click()}
                      className="w-full bg-[#080809] border-2 border-dashed border-[#1a1b22] rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#FF5C00]/30 hover:bg-[#FF5C00]/5 transition-all group min-h-[120px]"
                    >
                      {form.imagen_url
                        ? <img src={form.imagen_url} alt="" className="max-h-32 rounded-lg object-contain" />
                        : <>
                            <ImageIcon size={28} className="text-white/20 group-hover:text-[#FF5C00]/40 transition-colors" />
                            <p className="text-gray-500 text-sm text-center">
                              {uploading ? 'Subiendo...' : 'Haz clic para seleccionar imagen de portada'}
                            </p>
                            <p className="text-gray-600 text-xs">Recomendado: 1200×630px · Máx 5MB</p>
                          </>
                      }
                    </div>

                    {form.imagen_url && (
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, imagen_url: '' })); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black border border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <input ref={portadaInputRef} type="file" accept="image/*" onChange={handlePortadaUpload} className="hidden" />
                </Field>
 
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-300 font-medium">Imágenes de muestra</label>
                    {muestraFiles.length > 0 && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                        muestraFiles.length >= 13
                          ? 'bg-red-500/10 border-red-500/40 text-red-400'
                          : muestraFiles.length >= 8
                          ? 'bg-orange-500/10 border-[#FF5C00]/40 text-[#FF5C00]'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}>
                        {muestraFiles.length}/12
                      </span>
                    )}
                  </div>
                  {muestraError && <p className="text-red-400 text-xs">{muestraError}</p>}
                  <MuestraGalleryUpload
                    files={muestraFiles}
                    onChange={handleMuestraChange}
                    onError={setMuestraError}
                  />
                </div>
 
                <Field label="Categoría" required>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIAS.map(cat => (
                      <button key={cat} type="button" onClick={() => toggleArray('categoria', cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          form.categoria.includes(cat)
                            ? 'bg-[#FF5C00] border-[#FF5C00] text-white'
                            : 'border-[#1a1b22] text-gray-400 hover:border-[#FF5C00]/40'
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </Field>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="GitHub URL">
                    <input type="url" placeholder="https://github.com/..." value={form.github_url}
                      onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))}
                      className="w-full bg-[#080809] border border-[#1a1b22] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5C00]/50 transition-all placeholder:text-gray-600" />
                  </Field>
                  <Field label="Demo URL">
                    <input type="url" placeholder="https://..." value={form.demo_url}
                      onChange={e => setForm(f => ({ ...f, demo_url: e.target.value }))}
                      className="w-full bg-[#080809] border border-[#1a1b22] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5C00]/50 transition-all placeholder:text-gray-600" />
                  </Field>
                </div>
 
                <Field label="Tecnologías">
                  <div className="flex flex-wrap gap-2">
                    {TECNOLOGIAS.map(tech => (
                      <button key={tech} type="button" onClick={() => toggleArray('tecnologias', tech)}
                        className={`px-3 py-1 rounded-full text-xs border transition-all ${
                          form.tecnologias.includes(tech)
                            ? 'border-[#FF5C00] text-white bg-[#FF5C00]/10'
                            : 'border-[#1a1b22] text-gray-400 hover:border-[#FF5C00]/30'
                        }`}>
                        {tech}
                      </button>
                    ))}
                  </div>
                </Field>
 
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.destacado}
                    onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))}
                    className="accent-[#FF5C00] w-4 h-4" />
                  <span className="text-gray-400 text-sm">Marcar como proyecto destacado</span>
                </label>
              </div>
            </div>
 
            {/* ── Bloque editor ── */}
            <div className="bg-[#0c0d11] border border-[#1a1b22] rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={16} className="text-[#FF5C00]" />
                <span className="text-white font-bold text-sm">Contenido del proyecto</span>
              </div>
              <p className="text-gray-500 text-xs mb-6">
                Escribí sobre tu proyecto — presioná <kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-300">/</kbd> para insertar imágenes, galerías, bloques de código y más.
              </p>
 
              <ProyectoEditor
                value={blocks}
                onChange={setBlocks}
                uploadFn={uploadToCloudinary}
              />
            </div>
 
            {/* Bottom actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pb-10">
              <button onClick={() => handleSave(false)} disabled={saving || publishing}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#FF5C00]/40 text-[#FF5C00] text-sm font-medium hover:bg-[#FF5C00]/10 transition-all disabled:opacity-50">
                <Save size={15} />
                {saving ? 'Guardando...' : 'Guardar borrador'}
              </button>
              <button onClick={() => handleSave(true)} disabled={saving || publishing || !form.titulo}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5C00] hover:bg-orange-600 text-white text-sm font-semibold transition-all disabled:opacity-50">
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