export default function Home() {
  return (
    <div className="relative h-full flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src="/fondoDePantalla.png"
        alt=""
        className="absolute inset-0 w-full h-full object-contain -z-10 scale-90"
      />

      {/* Círculo de Neón de Fondo (Glow Effect) */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 max-w-6xl w-full z-10">
        
        {/* Columna Izquierda: Espacio vacío para futuro contenido */}
        <div className="flex flex-col justify-center">
          
        </div>

        {/* Columna Derecha: Espacio vacío para futuro contenido */}
        <div className="flex items-center justify-center">

        </div>

      </div>
    </div>
  );
}