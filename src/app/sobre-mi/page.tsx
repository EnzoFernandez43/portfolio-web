import SobreMiSection from '@/components/sobre-mi/SobreMiSection';
import { getSobreMi } from '@/actions/sobreMi';

export default async function Page() {
  const data = await getSobreMi();
  return (
    <main className="relative min-h-screen z-0">
      {/* Desktop */}
      <style>{`
  .bg-desktop {
    background-size: 150%;
    background-position: center 30px;
  }
  @media (min-width: 768px) and (max-width: 2560px) {
    .bg-desktop {
      background-size: 110%;   /* ajustá este % para achicar */
      background-position: center 30px;
    }
  }
`}</style>
      <div
        className="bg-desktop hidden md:block absolute inset-0 w-full h-full -z-10"
        style={{
          backgroundImage: 'url(/fondoDePantallaSobreMi.png)',
          backgroundRepeat: 'no-repeat',
        }}
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
