import SobreMiSection from '@/components/sobre-mi/SobreMiSection';
import { getSobreMi } from '@/actions/sobreMi';

export default async function Page() {
  const data = await getSobreMi();
  return (
    <main className="relative min-h-screen z-0">
      {/* Desktop */}
      <img
        src="/fondoDePantallaSobreMi.png"
        alt=""
        className="hidden md:block absolute inset-0 w-full h-full object-cover pointer-events-none -z-10"
        style={{ transform: 'scale(0.5) translateY(-50%)' }}
      />
      {/* Mobile: absoluta, no empuja el contenido */}
      <div className="md:hidden absolute top-0 left-0 w-full h-[420px] overflow-hidden -z-10">
        <img
          src="/fondoDePantallaSobreMiMobile.png"
          alt=""
          className="w-full h-full object-cover object-top scale-125"
        />
      </div>
      <SobreMiSection initialData={data} />
    </main>
  );
}
