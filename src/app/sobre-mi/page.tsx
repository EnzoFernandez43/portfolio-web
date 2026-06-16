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
      <style>{`
  .bg-mobile {
    background-position: center -150px;
    background-size: 140%;
  }
  @media (min-width: 375px) {
    .bg-mobile {
      background-position: center -180px;
      background-size: 140%;
    }
  }
  @media (min-width: 425px) {
    .bg-mobile {
      background-position: center -180px;
      background-size: 595px; /* 425px * 1.4 = tamaño fijo desde acá */
    }
  }
`}</style>
      <div
        className="bg-mobile md:hidden absolute top-0 left-0 w-full h-full -z-10"
        style={{
          backgroundImage: 'url(/fondoDePantallaSobreMiMobile.png)',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <SobreMiSection initialData={data} />
    </main>
  );
}
