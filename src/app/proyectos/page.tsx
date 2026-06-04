import ProyectosSection from '@/components/proyectos/ProyectosSection';

export default function Page() {
  return (
    <main
      className="min-h-screen pt-20"
      style={{ backgroundImage: "url('/fondoPantallaProyectos.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: 'black' }}
    >
      <ProyectosSection />
    </main>
  );
}