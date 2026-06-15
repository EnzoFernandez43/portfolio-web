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
      {/* Mobile */}
      <div
        className="md:hidden absolute top-0 left-0 w-full h-full -z-10"
        style={{
          backgroundImage: 'url(/fondoDePantallaSobreMiMobile.png)',
          backgroundSize: '140%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center -180px', // ajustá este valor
        }}
      />
      <SobreMiSection initialData={data} />
    </main>
  );
}
