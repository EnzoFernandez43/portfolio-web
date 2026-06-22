import ContactoSection from '@/components/contacto/ContactoSection';

export default function Page() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundImage: "url('/fondoPantallaProyectos.webp')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: 'black' }}
    >
      <ContactoSection />
    </main>
  );
}