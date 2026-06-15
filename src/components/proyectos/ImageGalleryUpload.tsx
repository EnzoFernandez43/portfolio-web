import React, { useState, useEffect, useRef } from "react";
import { LuInfo, LuVideo, LuEye, LuTrash2 } from "react-icons/lu";

// --- ICONOS ---
const IconUpload = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);
const IconTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

interface ImageGalleryUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  onError: (message: string) => void;
  onPreview?: (index: number) => void;
  disabled?: boolean;
}

// CONFIGURACIÓN DE LÍMITES
const MAX_VIDEOS = 1;
const MAX_IMAGES = 12; // 1 portada + 12 adicionales
const MAX_VIDEO_SIZE_MB = 50;
const MAX_IMAGE_SIZE_MB = 10;

// 🔥 NUEVO: Función auxiliar para extraer la duración de un video en segundos
const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => resolve(0);
    video.src = URL.createObjectURL(file);
  });
};

export default function ImageGalleryUpload({
  files,
  onChange,
  onError,
  onPreview,
  disabled = false,
}: ImageGalleryUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeOverlayIndex, setActiveOverlayIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  // 🔥 REFACTOR: Ahora la función es asíncrona para poder esperar los metadatos del video
  const processFiles = async (newFiles: File[]) => {
    const currentVideos = files.filter((f) =>
      f.type.startsWith("video/"),
    ).length;
    let newVideoCount = 0;
    let errorMsg = "";

    const existingSignatures = new Set(files.map((f) => `${f.name}-${f.size}`));
    const validFiles: File[] = [];
    const currentImages = files.filter(f => !f.type.startsWith('video/')).length;
    const currentTotal = files.length;

    for (const file of newFiles) {
      const isVideo = file.type.startsWith("video/");
      const sizeMB = file.size / (1024 * 1024);
      const signature = `${file.name}-${file.size}`;

      if (existingSignatures.has(signature)) continue;

      if (isVideo && sizeMB > MAX_VIDEO_SIZE_MB) {
        errorMsg = `El video ${file.name} supera los ${MAX_VIDEO_SIZE_MB}MB.`;
        continue;
      }
      if (!isVideo && sizeMB > MAX_IMAGE_SIZE_MB) {
        errorMsg = `La imagen ${file.name} supera los ${MAX_IMAGE_SIZE_MB}MB.`;
        continue;
      }

      if (isVideo) {
        if (currentVideos + newVideoCount >= MAX_VIDEOS) {
          errorMsg = `Solo podés subir hasta ${MAX_VIDEOS} video.`;
          continue;
        }

        // 🔥 LÓGICA DE TIEMPO: Validamos que no exceda los 60 segundos
        const durationInSeconds = await getVideoDuration(file);
        if (durationInSeconds > 60) {
          errorMsg = `El video dura ${Math.round(durationInSeconds)}s. El máximo es 1 minuto (60s).`;
          continue;
        }

        newVideoCount++;
      }

      if (!isVideo && currentImages + validFiles.filter(f => !f.type.startsWith('video/')).length >= MAX_IMAGES) {
        errorMsg = `Máximo ${MAX_IMAGES} imágenes en total.`;
        continue;
      }

      validFiles.push(file);
      existingSignatures.add(signature);
    }

    if (errorMsg) onError(errorMsg);

    const allFiles = [...files, ...validFiles];

    // 🔥 LÓGICA DE ORDENAMIENTO ESTRICTO: El video SIEMPRE a la posición 2 (Index 1)
    const justImages = allFiles.filter((f) => !f.type.startsWith("video/"));
    const theVideo = allFiles.filter((f) => f.type.startsWith("video/"));

    let sortedFiles: File[] = [];
    if (justImages.length > 0) {
      sortedFiles.push(justImages[0]); // Siempre la primera imagen va como Portada (0)
      if (theVideo.length > 0) sortedFiles.push(theVideo[0]); // Si hay video, va a la posición 2 (1)
      sortedFiles = sortedFiles.concat(justImages.slice(1)); // Luego el resto de las imágenes
    } else {
      sortedFiles = [...theVideo]; // Caso extremo: subió el video primero y todavía no hay fotos
    }

    if (validFiles.length > 0) {
      onChange(sortedFiles);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleDropZoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newFiles = [...files];
    const [movedFile] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(targetIndex, 0, movedFile);

    // 🔥 MAGIA NEGRA: Luego de que el usuario reordene las fotos,
    // re-aplicamos la regla estricta para que el video NUNCA se mueva del Index 1.
    const justImages = newFiles.filter((f) => !f.type.startsWith("video/"));
    const theVideo = newFiles.filter((f) => f.type.startsWith("video/"));

    let finalArr: File[] = [];
    if (justImages.length > 0) {
      finalArr.push(justImages[0]);
      if (theVideo.length > 0) finalArr.push(theVideo[0]);
      finalArr = finalArr.concat(justImages.slice(1));
    } else {
      finalArr = [...theVideo];
    }

    onChange(finalArr);
    setDraggedIndex(null);
  };

  const isFull = files.length >= MAX_IMAGES + MAX_VIDEOS;

  return (
    <div className="space-y-6">
      {/* 1. Grilla de Galería */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
          {files.map((file, index) => {
            const isVideo = file.type.startsWith("video/");

            return (
              <div
                key={`${file.name}-${index}`}
                draggable={!isVideo}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() =>
                  setActiveOverlayIndex(
                    activeOverlayIndex === index ? null : index,
                  )
                }
                className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm select-none aspect-square cursor-move transition-all hover:shadow-md"
              >
                {/* RENDERIZADO CONDICIONAL: IMAGEN O VIDEO */}
                {isVideo ? (
                  <div className="w-full h-full bg-black relative flex items-center justify-center">
                    <video
                      src={previews[index]}
                      className="w-full h-full object-cover opacity-80"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <LuVideo className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={previews[index]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* 1. La capa oscura de fondo */}
                <div
                  className={`absolute inset-0 transition-all duration-200 pointer-events-none
                  ${activeOverlayIndex === index ? "bg-black/40" : "bg-transparent lg:group-hover:bg-black/20"}
                `}
                />

                {/* 2. Capa oscura adicional con botones de acción */}
                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-200 flex items-end justify-end gap-4 p-2 z-20
                  ${activeOverlayIndex === index ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"}
                `}>
                  {/* Botón Vista Previa (Ojo) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview?.(index);
                    }}
                    className="p-2.5 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full transition-all transform hover:scale-110 shadow-lg border border-white/20"
                    title="Vista previa"
                  >
                    <LuEye size={20} />
                  </button>

                  {/* Botón Eliminar (Papelera) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(files.filter((_, i) => i !== index));
                      setActiveOverlayIndex(null);
                    }}
                    className="p-2.5 bg-red-500/20 backdrop-blur-md hover:bg-red-500/80 text-white rounded-full transition-all transform hover:scale-110 shadow-lg border border-red-500/30"
                    title="Eliminar"
                  >
                    <LuTrash2 size={20} />
                  </button>
                </div>

                {/* 3. Mensajes de contexto */}
                <div className={`absolute inset-0 flex flex-col justify-between p-2 transition-opacity duration-200 pointer-events-none
                  ${activeOverlayIndex === index ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"}
                `}>
                  {!isVideo && (
                    <div className="text-center">
                      <span className="inline-block px-2 py-1 bg-black/60 text-white text-[10px] font-medium rounded-md backdrop-blur-sm">
                        Arrastrá para reordenar
                      </span>
                    </div>
                  )}
                  {isVideo && (
                    <div className="text-center">
                      <span className="inline-block px-2 py-1 bg-black/60 text-white text-[10px] font-medium rounded-md backdrop-blur-sm flex items-center justify-center gap-1">
                        <LuInfo className="w-3 h-3" /> Posición Fija
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Zona de Drop */}
      <div
        onClick={() => !disabled && !isFull && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDropZoneDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${disabled || isFull ? "cursor-not-allowed opacity-60 border-slate-200 dark:border-slate-800" : "cursor-pointer border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-orange-400"}
          ${!disabled && !isFull && isDragOver ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 scale-[1.02]" : ""}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          onChange={handleFileSelect}
          disabled={disabled || isFull}
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div
            className={`p-3 rounded-full transition-colors ${isDragOver && !isFull ? "bg-orange-100 text-orange-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
          >
            <IconUpload />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {isFull ? "Galería completa" : (isDragOver ? "¡Soltá los archivos acá!" : "Hacé clic o arrastrá fotos y videos")}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Máx. {MAX_IMAGES} fotos (10MB c/u) · {MAX_VIDEOS} video (1 min / {MAX_VIDEO_SIZE_MB}MB)
            </p>
          </div>
        </div>
      </div>

      {/* 3. CONSEJO PRO */}
      <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-900/10 p-3 rounded-lg border border-orange-100 dark:border-orange-800/30">
        <LuInfo className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
          <strong className="text-orange-700 dark:text-orange-400 font-bold">
            Consejo:
          </strong>{" "}
          Subí al menos 5 fotos de alta calidad. Podés agregar hasta{" "}
          {MAX_VIDEOS} video corto (máx. 1 min) para mostrar el ambiente.
        </p>
      </div>
    </div>
  );
}