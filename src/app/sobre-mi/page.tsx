import SobreMiSection from '@/components/sobre-mi/SobreMiSection';
import { getSobreMi } from '@/actions/sobreMi';

export default async function Page() {
  const data = await getSobreMi();
  return (
    <main className="relative min-h-screen z-0">
      {/* Desktop: imagen de fondo absoluta */}
      <img
        src="/fondoDePantallaSobreMi.png"
        alt=""
        className="hidden md:block absolute inset-0 w-full h-full object-cover pointer-events-none -z-10"
        style={{ transform: 'scale(0.5) translateY(-50%)' }}
      />
      {/* Mobile: imagen como hero en el flujo, NO absoluta */}
      <div className="md:hidden w-full h-[420px] overflow-hidden flex items-center justify-center bg-[#050507]">
        <img
          src="/fondoDePantallaSobreMiMobile.png"
          alt=""
          className="w-full h-full object-cover object-center scale-125"
        />
      </div>
      <SobreMiSection initialData={data} />
    </main>
  );
}
