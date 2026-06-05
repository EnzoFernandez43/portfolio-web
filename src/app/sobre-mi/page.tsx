import SobreMiSection from '@/components/sobre-mi/SobreMiSection';

export default function Page() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundImage: "url('/fondoDePantallaSobreMi.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: 'black' }}
    >
      <SobreMiSection />
    </main>
  );
}