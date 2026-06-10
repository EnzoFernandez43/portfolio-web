import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX, LuChevronLeft, LuChevronRight, LuMaximize, LuMinimize, LuPlay } from "react-icons/lu";
import { LazyImage } from "../../components/LazyImage";
import { getOptimizedImageUrl } from "../../utils/imageUtils";
import { useGlobalScrollLock } from "../../hooks/useGlobalScrollLock";
import { useHardwareBackButton } from "../../hooks/useHardwareBackButton"; // <--- IMPORT

interface ImageLightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const ArrowButton = ({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:bg-black/40 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50
      ${direction === "left" ? "left-4 lg:left-8" : "right-4 lg:right-8"}`}
    aria-label={direction === "left" ? "Imagen anterior" : "Siguiente imagen"}
  >
    {direction === "left" ? (
      <LuChevronLeft size={28} />
    ) : (
      <LuChevronRight size={28} />
    )}
  </button>
);

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  startIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  useGlobalScrollLock(true);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1,
        );
      if (e.key === "ArrowLeft")
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? images.length - 1 : prevIndex - 1,
        );
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, onClose]);

  // --- Sincronizar scroll de miniaturas con la imagen activa ---
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeThumbnail = thumbnailContainerRef.current.children[
        currentIndex
      ] as HTMLElement;
      if (activeThumbnail) {
        // Centra el thumbnail activo en el contenedor de miniaturas
        const containerWidth = thumbnailContainerRef.current.offsetWidth;
        const scrollLeft =
          activeThumbnail.offsetLeft -
          containerWidth / 2 +
          activeThumbnail.offsetWidth / 2;
        thumbnailContainerRef.current.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]);

  // --- Lógica de Pantalla Completa ---
  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      try {
        if (lightboxRef.current?.requestFullscreen) {
          await lightboxRef.current.requestFullscreen();
        }
      } catch (err) {
        console.error("Error al intentar activar pantalla completa:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // --- Helper: Detección de Video ---
  const isVideo = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return (
      lowerUrl.match(/\.(mp4|webm|ogg|mov)$/) != null ||
      lowerUrl.includes("/video/upload/")
    );
  };

  // 🔥 Lógica unificada: si está en fullscreen, sale. Si no, cierra el modal.
  const handleHardwareBack = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      onClose();
    }
  }, [onClose]);

  // 🔥 Hook con prioridad 200 (máxima prioridad para overlays)
  // Como el padre ya renderiza el componente condicionalmente, pasamos 'true'
  useHardwareBackButton(200, true, handleHardwareBack);

  return (
    <motion.div
      ref={lightboxRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex flex-col items-center bg-black/95 backdrop-blur-md"
      onClick={() => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Controles Top Right */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-3">
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black/40 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all shadow-lg"
          aria-label="Pantalla completa"
          title="Pantalla Completa"
        >
          {isFullscreen ? <LuMinimize size={22} /> : <LuMaximize size={22} />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (document.fullscreenElement) document.exitFullscreen();
            onClose();
          }}
          className="p-2 bg-black/40 rounded-full flex items-center justify-center text-white/80 hover:bg-red-500/80 hover:text-white transition-all shadow-lg"
          aria-label="Cerrar galería"
        >
          <LuX size={24} />
        </button>
      </div>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-30 bg-black/40 text-white font-medium text-sm px-4 py-1.5 rounded-full shadow-lg">
        {currentIndex + 1} / {images.length}
      </div>

      {/* ============================================================== */}
      {/* CAROUSEL AREA - MODIFICADO ESTRATÉGICAMENTE */}
      {/* ============================================================== */}

      {/* CAMBIO 1: Altura explícita en el contenedor padre.
         Si hay miniaturas (tu tira mide 100px), el área principal mide 100vh - 100px.
         Si no hay miniaturas, ocupa toda la pantalla (h-screen).
         Quitamos el 'flex-1' y el padding 'p-4' que tenías aquí antes.
      */}
      <div
        className={`relative w-full flex items-center justify-center z-10 ${images.length > 1 ? "h-[calc(100vh-100px)]" : "h-screen"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <ArrowButton direction="left" onClick={goToPrevious} />
        )}

        {/* CAMBIO 2: Wrapper de la imagen.
           Este div ahora tiene 'w-full h-full' para llenar el contenedor padre.
           AQUÍ es donde ponemos el padding (p-4 md:p-8) para darle "aire" a la foto
           y que no toque los bordes de la pantalla ni las miniaturas.
        */}
        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="block w-full h-full flex items-center justify-center"
            >
              {isVideo(images[currentIndex]) ? (
                <video
                  src={images[currentIndex]}
                  controls
                  autoPlay
                  loop
                  controlsList="nodownload"
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-black"
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              ) : (
                <LazyImage
                  src={getOptimizedImageUrl(images[currentIndex], {
                    width: 1920,
                    quality: "auto:best",
                    format: "webp",
                  })}
                  alt={`Media ${currentIndex + 1}`}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl select-none"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <ArrowButton direction="right" onClick={goToNext} />
        )}
      </div>

      {/* Tira de Miniaturas (Thumbnails) */}
      {images.length > 1 && (
        <div
          className="w-full h-[100px] flex-shrink-0 flex justify-center items-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={thumbnailContainerRef}
            className="flex gap-3 overflow-x-auto p-2 px-4 custom-scrollbar"
          >
            {images.map((media, index) => {
              const isMediaVideo = isVideo(media);

              // 🔥 MAGIA CLOUDINARY: Si es video, le cambiamos la extensión a .jpg para sacar la miniatura
              const thumbnailSrc = isMediaVideo
                ? media.replace(/\.(mp4|mov|webm|avi|mkv|flv|wmv)$/i, ".jpg")
                : media;

              return (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer transition-all duration-300 ring-2 ring-offset-2 ring-offset-black/80 ${
                    currentIndex === index
                      ? "ring-orange-500 opacity-100 scale-110 z-10"
                      : "ring-transparent opacity-40 hover:opacity-100"
                  }`}
                >
                  {/* RENDERIZAMOS SIEMPRE UNA IMAGEN, PERO SI ES VIDEO LE PONEMOS EL ÍCONO ARRIBA */}
                  <LazyImage
                    src={getOptimizedImageUrl(thumbnailSrc, {
                      width: 150,
                      quality: "auto:low",
                      format: "webp",
                    })}
                    alt={`Thumb ${index + 1}`}
                    width={150}
                    height={150}
                    className={`w-full h-full object-cover ${isMediaVideo ? 'brightness-75' : ''}`}
                  />

                  {/* 🔥 Si es video, superponemos el Play */}
                  {isMediaVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LuPlay className="w-7 h-7 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};