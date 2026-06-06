import SobreMiSection from '@/components/sobre-mi/SobreMiSection';
import { getSobreMi } from '@/actions/sobreMi';

export default async function Page() {
    const data = await getSobreMi();
    return (
        <main className="min-h-screen"
            style={{ backgroundImage: "url('/fondoDePantallaSobreMi.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: 'black' }}>
            <SobreMiSection initialData={data} />
        </main>
    );
}