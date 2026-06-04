export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Círculo de Neón de Fondo (Glow Effect) */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 max-w-6xl w-full z-10">
        
        {/* Columna Izquierda: Texto */}
        <div className="flex flex-col justify-center">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-medium border border-purple-500/30 bg-purple-500/10 text-purple-300 rounded-full w-fit">
            👋 ¡Hola! Soy
          </div>
          <h1 className="text-6xl font-bold mb-4">
            Enzo <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Fernandez</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Ingeniero en Sistemas | Desarrollador Full-Stack
          </p>
          <div className="flex gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
              Ver proyectos
            </button>
            <button className="border border-gray-600 hover:border-gray-400 px-8 py-3 rounded-lg font-semibold transition-all">
              Contactar
            </button>
          </div>
        </div>

        {/* Columna Derecha: Placeholder de imagen/laptop */}
        <div className="flex items-center justify-center">
          <div className="w-full h-[300px] bg-slate-900/50 border border-slate-700 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            {/* Aquí luego pondremos una imagen de tu laptop o un componente 3D */}
            <span className="text-slate-500">[Imagen/Laptop aquí]</span>
          </div>
        </div>

      </div>
    </div>
  );
}