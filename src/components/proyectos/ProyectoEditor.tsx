'use client';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Quote, Code,
  Image as ImageIcon, Plus, X, GripVertical, ChevronDown,
  AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3,
  LayoutGrid, Type, Minus
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type BlockType =
  | 'paragraph'
  | 'h1' | 'h2' | 'h3'
  | 'quote'
  | 'code'
  | 'divider'
  | 'image'
  | 'image-grid';

type GridSpan = 1 | 2 | 4;

interface GridImage {
  url: string;
  span: GridSpan;
  caption: string;
}

interface Block {
  id: string;
  type: BlockType;
  // text blocks
  html?: string;
  align?: 'left' | 'center' | 'right';
  // single image
  url?: string;
  caption?: string;
  imageAlign?: 'izquierda' | 'centro' | 'derecha' | 'completo' | 'flotante-izq' | 'flotante-der';
  // image grid
  images?: GridImage[];
}

interface ProyectoEditorProps {
  value: Block[];
  onChange: (blocks: Block[]) => void;
  uploadFn: (file: File) => Promise<string>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyBlock(type: BlockType = 'paragraph'): Block {
  if (type === 'image') return { id: uid(), type, url: '', caption: '', imageAlign: 'centro' };
  if (type === 'image-grid') return { id: uid(), type, images: [] };
  if (type === 'divider') return { id: uid(), type };
  return { id: uid(), type, html: '', align: 'left' };
}

function blocksToHTML(blocks: Block[]): string {
  return blocks.map(b => {
    switch (b.type) {
      case 'h1': return `<h1 style="text-align:${b.align ?? 'left'}">${b.html}</h1>`;
      case 'h2': return `<h2 style="text-align:${b.align ?? 'left'}">${b.html}</h2>`;
      case 'h3': return `<h3 style="text-align:${b.align ?? 'left'}">${b.html}</h3>`;
      case 'quote': return `<blockquote>${b.html}</blockquote>`;
      case 'code': return `<pre><code>${b.html}</code></pre>`;
      case 'divider': return `<hr/>`;
      case 'image':
        return `<figure class="img-${b.imageAlign}"><img src="${b.url}" alt="${b.caption ?? ''}"/>${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`;
      case 'image-grid':
        const imgs = (b.images ?? []).map(img =>
          `<img src="${img.url}" alt="${img.caption}" style="grid-column:span ${img.span}"/>`
        ).join('');
        return `<div class="img-grid">${imgs}</div>`;
      default:
        return `<p style="text-align:${b.align ?? 'left'}">${b.html}</p>`;
    }
  }).join('\n');
}

// ─── Inline toolbar ──────────────────────────────────────────────────────────

function InlineToolbar({ onCmd }: { onCmd: (cmd: string, val?: string) => void }) {
  return (
    <div className="flex items-center gap-0.5 bg-[#0c0d11] border border-[#2a2b35] rounded-lg px-1.5 py-1 shadow-xl">
      {[
        { icon: <Bold size={12} />, cmd: 'bold' },
        { icon: <Italic size={12} />, cmd: 'italic' },
        { icon: <Underline size={12} />, cmd: 'underline' },
        { icon: <List size={12} />, cmd: 'insertUnorderedList' },
        { icon: <ListOrdered size={12} />, cmd: 'insertOrderedList' },
      ].map(({ icon, cmd }) => (
        <button
          key={cmd}
          type="button"
          onMouseDown={e => { e.preventDefault(); onCmd(cmd); }}
          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/8 transition-all"
        >
          {icon}
        </button>
      ))}
      <div className="w-px h-4 bg-white/10 mx-0.5" />
      <button
        type="button"
        onMouseDown={e => {
          e.preventDefault();
          const url = prompt('URL del enlace:');
          if (url) onCmd('createLink', url);
        }}
        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/8 transition-all text-[10px] font-mono font-bold"
      >
        A
      </button>
    </div>
  );
}

// ─── Block type picker (slash menu) ─────────────────────────────────────────

const BLOCK_MENU: { type: BlockType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: 'paragraph', label: 'Texto', icon: <Type size={14} />, desc: 'Párrafo normal' },
  { type: 'h1', label: 'Título 1', icon: <Heading1 size={14} />, desc: 'Encabezado grande' },
  { type: 'h2', label: 'Título 2', icon: <Heading2 size={14} />, desc: 'Encabezado mediano' },
  { type: 'h3', label: 'Título 3', icon: <Heading3 size={14} />, desc: 'Encabezado pequeño' },
  { type: 'quote', label: 'Cita', icon: <Quote size={14} />, desc: 'Bloque de cita' },
  { type: 'code', label: 'Código', icon: <Code size={14} />, desc: 'Bloque de código' },
  { type: 'image', label: 'Imagen', icon: <ImageIcon size={14} />, desc: 'Imagen con caption' },
  { type: 'image-grid', label: 'Galería', icon: <LayoutGrid size={14} />, desc: 'Grilla de imágenes' },
  { type: 'divider', label: 'Divisor', icon: <Minus size={14} />, desc: 'Línea separadora' },
];

function BlockMenu({ onSelect, onClose }: { onSelect: (t: BlockType) => void; onClose: () => void }) {
  return (
    <div className="absolute z-50 left-0 mt-1 w-56 bg-[#0c0d11] border border-[#2a2b35] rounded-xl shadow-2xl overflow-hidden">
      <div className="px-3 py-2 border-b border-white/5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Tipo de bloque</p>
      </div>
      {BLOCK_MENU.map(item => (
        <button
          key={item.type}
          type="button"
          onMouseDown={e => { e.preventDefault(); onSelect(item.type); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-all group"
        >
          <span className="text-[#FF5C00] shrink-0">{item.icon}</span>
          <div>
            <p className="text-white text-xs font-medium leading-tight">{item.label}</p>
            <p className="text-gray-500 text-[10px]">{item.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Single image block ──────────────────────────────────────────────────────

function ImageBlock({
  block,
  onChange,
  uploadFn,
}: {
  block: Block;
  onChange: (b: Partial<Block>) => void;
  uploadFn: (f: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFn(file);
    onChange({ url });
    setUploading(false);
  };

  const alignClass: Record<string, string> = {
    'izquierda':    'mr-auto',
    'centro':       'mx-auto',
    'derecha':      'ml-auto',
    'completo':     'w-full',
    'flotante-izq': 'float-left mr-4 mb-2',
    'flotante-der': 'float-right ml-4 mb-2',
  };

  const sizeClass: Record<string, string> = {
    'completo':     'w-full',
    'flotante-izq': 'w-1/2',
    'flotante-der': 'w-1/2',
  };

  const ac = alignClass[block.imageAlign ?? 'centro'] ?? alignClass['centro'];
  const sc = sizeClass[block.imageAlign ?? 'centro'] ?? 'max-w-lg';

  return (
    <div className="flex flex-col gap-2">
      {/* Align controls */}
      <div className="flex gap-1 flex-wrap">
        {(['izquierda', 'centro', 'derecha', 'flotante-izq', 'flotante-der', 'completo'] as const).map(a => (
          <button
            key={a}
            type="button"
            onClick={() => onChange({ imageAlign: a })}
            className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
              block.imageAlign === a
                ? 'border-[#FF5C00] text-[#FF5C00] bg-[#FF5C00]/10'
                : 'border-white/10 text-gray-500 hover:border-white/20'
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {block.url ? (
        <div className={`${sc} ${ac} relative group`}>
          <img src={block.url} alt={block.caption} className="rounded-xl w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange({ url: '' })}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="w-full bg-[#080809] border-2 border-dashed border-[#2a2b35] rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#FF5C00]/30 hover:bg-[#FF5C00]/5 transition-all"
        >
          <ImageIcon size={24} className="text-white/20" />
          <p className="text-gray-500 text-sm">{uploading ? 'Subiendo...' : 'Haz clic para subir imagen'}</p>
        </div>
      )}
      <input
        placeholder="Descripción de la imagen (opcional)"
        value={block.caption ?? ''}
        onChange={e => onChange({ caption: e.target.value })}
        className="bg-transparent border-b border-white/10 px-1 py-1 text-xs text-gray-500 outline-none focus:border-[#FF5C00]/40 transition-all placeholder:text-gray-600 text-center"
      />
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
    </div>
  );
}

// ─── Image grid block ────────────────────────────────────────────────────────

const SPAN_LABELS: Record<GridSpan, string> = { 1: '1 col', 2: '2 col', 4: 'full' };

function ImageGridBlock({
  block,
  onChange,
  uploadFn,
}: {
  block: Block;
  onChange: (b: Partial<Block>) => void;
  uploadFn: (f: File) => Promise<string>;
}) {
  const images = block.images ?? [];
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const updateImage = (idx: number, patch: Partial<GridImage>) => {
    const next = images.map((img, i) => i === idx ? { ...img, ...patch } : img);
    onChange({ images: next });
  };

  const removeImage = (idx: number) => {
    onChange({ images: images.filter((_, i) => i !== idx) });
  };

  const addSlot = () => {
    onChange({ images: [...images, { url: '', span: 1, caption: '' }] });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    const url = await uploadFn(file);
    updateImage(idx, { url });
    setUploadingIdx(null);
  };

  // Build a 4-column CSS grid
  return (
    <div className="flex flex-col gap-3">
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
      >
        {images.map((img, idx) => {
          const inputRef = useRef<HTMLInputElement>(null);
          return (
            <div
              key={idx}
              style={{ gridColumn: `span ${img.span}` }}
              className="relative group rounded-xl overflow-hidden bg-[#080809] border border-[#2a2b35] aspect-video"
            >
              {img.url ? (
                <>
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                  {/* Controls overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                    <div className="flex gap-1">
                      {([1, 2, 4] as GridSpan[]).map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateImage(idx, { span: s })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                            img.span === s
                              ? 'border-[#FF5C00] text-[#FF5C00] bg-[#FF5C00]/20'
                              : 'border-white/30 text-white/70 hover:border-white/60'
                          }`}
                        >
                          {SPAN_LABELS[s]}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-1"
                    >
                      <X size={10} /> Eliminar
                    </button>
                  </div>
                  {/* Caption */}
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                      <p className="text-white text-[10px] text-center truncate">{img.caption}</p>
                    </div>
                  )}
                </>
              ) : (
                <div
                  onClick={() => inputRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#FF5C00]/5 transition-all"
                >
                  {uploadingIdx === idx
                    ? <span className="text-[10px] text-gray-500">Subiendo...</span>
                    : <>
                        <Plus size={16} className="text-white/20" />
                        <span className="text-[10px] text-gray-600">Agregar</span>
                      </>
                  }
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={e => handleUpload(e, idx)}
                className="hidden"
              />
            </div>
          );
        })}

        {/* Add slot button */}
        {images.length < 8 && (
          <div
            onClick={addSlot}
            className="rounded-xl border-2 border-dashed border-[#2a2b35] aspect-video flex items-center justify-center cursor-pointer hover:border-[#FF5C00]/30 hover:bg-[#FF5C00]/5 transition-all"
          >
            <Plus size={18} className="text-white/20" />
          </div>
        )}
      </div>
      <p className="text-gray-600 text-[10px]">Hover sobre una imagen para cambiar su tamaño (1, 2 o 4 columnas).</p>
    </div>
  );
}

// ─── Text block ──────────────────────────────────────────────────────────────

const TEXT_TAG: Record<string, string> = {
  paragraph: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  quote: 'blockquote',
  code: 'pre',
};

const TEXT_CLASS: Record<string, string> = {
  paragraph: 'text-gray-300 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
  h1: 'text-3xl font-black text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
  h2: 'text-2xl font-bold text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
  h3: 'text-lg font-semibold text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
  quote: 'text-gray-400 italic border-l-2 border-[#FF5C00] pl-4 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
  code: 'font-mono text-xs text-green-400 bg-black rounded-xl p-4 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
};

const PLACEHOLDER: Record<string, string> = {
  paragraph: 'Escribe algo o presiona / para insertar un bloque...',
  h1: 'Título principal',
  h2: 'Subtítulo',
  h3: 'Encabezado',
  quote: 'Escribe una cita...',
  code: 'código aquí...',
};

function TextBlock({
  block,
  onUpdate,
  onKeyDown,
  onFocus,
  autoFocus,
}: {
  block: Block;
  onUpdate: (patch: Partial<Block>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onFocus: () => void;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && ref.current) {
      ref.current.innerHTML = block.html ?? '';
      initialized.current = true;
    }
  }, []);

  const handleInput = () => {
    onUpdate({ html: ref.current?.innerHTML ?? '' });
  };

  const execCmd = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    ref.current?.focus();
    onUpdate({ html: ref.current?.innerHTML ?? '' });
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      autoFocus={autoFocus}
      data-placeholder={PLACEHOLDER[block.type] ?? ''}
      style={{ textAlign: block.align ?? 'left' }}
      className={`outline-none w-full min-h-[1.5em] ${TEXT_CLASS[block.type] ?? TEXT_CLASS.paragraph}
        empty:before:content-[attr(data-placeholder)] empty:before:text-gray-600 empty:before:pointer-events-none`}
    />
  );
}

// ─── Main Editor ─────────────────────────────────────────────────────────────

export default function ProyectoEditor({ value, onChange, uploadFn }: ProyectoEditorProps) {
  const blocks = value.length ? value : [emptyBlock('paragraph')];
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const update = useCallback((id: string, patch: Partial<Block>) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...patch } : b));
  }, [blocks, onChange]);

  const insertAfter = useCallback((id: string, type: BlockType = 'paragraph') => {
    const idx = blocks.findIndex(b => b.id === id);
    const nb = emptyBlock(type);
    const next = [...blocks];
    next.splice(idx + 1, 0, nb);
    onChange(next);
    setFocusedId(nb.id);
  }, [blocks, onChange]);

  const remove = useCallback((id: string) => {
    if (blocks.length === 1) return;
    const idx = blocks.findIndex(b => b.id === id);
    const next = blocks.filter(b => b.id !== id);
    onChange(next);
    const prevBlock = next[Math.max(0, idx - 1)];
    setFocusedId(prevBlock?.id ?? null);
  }, [blocks, onChange]);

  const changeType = useCallback((id: string, type: BlockType) => {
    const b = blocks.find(b => b.id === id);
    if (!b) return;
    onChange(blocks.map(bl => bl.id === id
      ? { ...emptyBlock(type), id, html: bl.html }
      : bl
    ));
  }, [blocks, onChange]);

  const handleKeyDown = useCallback((id: string) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enter → new paragraph
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      insertAfter(id);
      return;
    }
    // Backspace on empty → remove
    const b = blocks.find(b => b.id === id);
    if (e.key === 'Backspace' && (!b?.html || b.html === '')) {
      e.preventDefault();
      remove(id);
      return;
    }
    // Slash → open menu
    if (e.key === '/') {
      setTimeout(() => setMenuOpenId(id), 0);
    }
  }, [blocks, insertAfter, remove]);

  // Drag & drop reorder
  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const from = blocks.findIndex(b => b.id === dragId);
    const to = blocks.findIndex(b => b.id === targetId);
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
    setDragId(null);
    setDragOverId(null);
  };

  const wordCount = blocks.reduce((acc, b) => {
    const text = (b.html ?? '').replace(/<[^>]+>/g, '');
    return acc + (text.trim() ? text.trim().split(/\s+/).length : 0);
  }, 0);

  return (
    <div className="flex flex-col gap-1">
      {blocks.map((block, idx) => {
        const isFocused = focusedId === block.id;
        const isTextBlock = ['paragraph', 'h1', 'h2', 'h3', 'quote', 'code'].includes(block.type);

        return (
          <div
            key={block.id}
            draggable
            onDragStart={() => setDragId(block.id)}
            onDragOver={e => { e.preventDefault(); setDragOverId(block.id); }}
            onDrop={() => handleDrop(block.id)}
            onDragEnd={() => { setDragId(null); setDragOverId(null); }}
            className={`group relative flex gap-2 items-start py-1 px-1 rounded-xl transition-all clear-both
              ${dragOverId === block.id ? 'border-t-2 border-[#FF5C00]' : ''}
              ${dragId === block.id ? 'opacity-40' : ''}
            `}
          >
            {/* Left gutter: drag handle + add button */}
            <div className="flex flex-col items-center gap-0.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 w-6">
              <button
                type="button"
                onClick={() => insertAfter(block.id)}
                className="w-5 h-5 rounded flex items-center justify-center text-gray-600 hover:text-[#FF5C00] hover:bg-[#FF5C00]/10 transition-all"
                title="Agregar bloque"
              >
                <Plus size={11} />
              </button>
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing transition-all"
                title="Arrastrar para reordenar"
              >
                <GripVertical size={11} />
              </div>
            </div>

            {/* Block content */}
            <div className="flex-1 min-w-0 relative">

              {/* Block type picker (top of focused text block) */}
              {isFocused && isTextBlock && (
                <div className="absolute -top-8 left-0 flex items-center gap-1 z-10">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuOpenId(menuOpenId === block.id ? null : block.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-[#0c0d11] border border-[#2a2b35] text-gray-400 text-[10px] hover:text-white hover:border-[#FF5C00]/40 transition-all"
                    >
                      {BLOCK_MENU.find(m => m.type === block.type)?.label ?? 'Texto'}
                      <ChevronDown size={10} />
                    </button>
                    {menuOpenId === block.id && (
                      <BlockMenu
                        onSelect={t => { changeType(block.id, t); setMenuOpenId(null); }}
                        onClose={() => setMenuOpenId(null)}
                      />
                    )}
                  </div>

                  {/* Align (non-code, non-quote) */}
                  {['paragraph', 'h1', 'h2', 'h3'].includes(block.type) && (
                    <div className="flex gap-0.5 bg-[#0c0d11] border border-[#2a2b35] rounded px-1 py-0.5">
                      {(['left', 'center', 'right'] as const).map(a => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => update(block.id, { align: a })}
                          className={`p-1 rounded transition-all ${block.align === a ? 'text-[#FF5C00]' : 'text-gray-600 hover:text-gray-300'}`}
                        >
                          {a === 'left' ? <AlignLeft size={10} /> : a === 'center' ? <AlignCenter size={10} /> : <AlignRight size={10} />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Inline formatting */}
                  <InlineToolbar onCmd={(cmd, val) => document.execCommand(cmd, false, val)} />

                  {/* Delete */}
                  {blocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(block.id)}
                      className="p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              )}

              {/* Slash menu (below block) */}
              {menuOpenId === block.id && !isFocused && (
                <div className="relative">
                  <BlockMenu
                    onSelect={t => { insertAfter(block.id, t); setMenuOpenId(null); }}
                    onClose={() => setMenuOpenId(null)}
                  />
                </div>
              )}

              {/* Render block */}
              {block.type === 'divider' && (
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-[#2a2b35]" />
                  <div className="w-1 h-1 rounded-full bg-[#FF5C00]" />
                  <div className="flex-1 h-px bg-[#2a2b35]" />
                </div>
              )}

              {block.type === 'image' && (
                <ImageBlock
                  block={block}
                  onChange={patch => update(block.id, patch)}
                  uploadFn={uploadFn}
                />
              )}

              {block.type === 'image-grid' && (
                <ImageGridBlock
                  block={block}
                  onChange={patch => update(block.id, patch)}
                  uploadFn={uploadFn}
                />
              )}

              {isTextBlock && (
                <TextBlock
                  block={block}
                  onUpdate={patch => update(block.id, patch)}
                  onKeyDown={handleKeyDown(block.id)}
                  onFocus={() => setFocusedId(block.id)}
                  autoFocus={focusedId === block.id}
                />
              )}
            </div>
          </div>
        );
      })}

      {/* Add block button (bottom) */}
      <div className="relative mt-2 flex items-center gap-3 clear-both">
        <button
          type="button"
          onClick={() => {
            const last = blocks[blocks.length - 1];
            setMenuOpenId(menuOpenId ? null : last.id + '_bottom');
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-[#2a2b35] text-gray-600 text-xs hover:border-[#FF5C00]/40 hover:text-[#FF5C00] hover:bg-[#FF5C00]/5 transition-all"
        >
          <Plus size={12} />
          Agregar bloque
        </button>
        {menuOpenId === blocks[blocks.length - 1]?.id + '_bottom' && (
          <div className="absolute bottom-full left-0 mb-1">
            <BlockMenu
              onSelect={t => { insertAfter(blocks[blocks.length - 1].id, t); setMenuOpenId(null); }}
              onClose={() => setMenuOpenId(null)}
            />
          </div>
        )}
        <span className="text-[10px] font-mono text-gray-600 ml-auto">PALABRAS: {wordCount}</span>
      </div>
    </div>
  );
}

// ─── Serializer export ───────────────────────────────────────────────────────
export { blocksToHTML, type Block, type BlockType };