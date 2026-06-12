import type { Metadata } from "next";
import { Bebas_Neue, DM_Mono, Barlow_Condensed, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import ScrollbarProvider from '@/components/ScrollbarProvider';
import { AuthProvider } from '@/context/AuthContext';

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  weight: ["400", "600"],
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enzo Fernandez | Portfolio Full-Stack",
  description: "Portfolio profesional de Enzo Fernandez, Ingeniero en Sistemas y desarrollador Full-Stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${dmMono.variable} ${barlowCondensed.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col text-[110%]" style={{ fontFamily: 'var(--font-dm-mono)', backgroundColor: '#050507' }}>
        {/* Fondos globales — fuera del AuthProvider para evitar stacking context */}
        <img src="/fondoDePantalla.png" alt="" className="hidden md:block fixed inset-0 w-full h-full object-cover pointer-events-none" style={{ zIndex: -1 }} />
        <img src="/fondoDePantallaMobile.png" alt="" className="md:hidden fixed inset-0 w-full h-full object-cover pointer-events-none" style={{ zIndex: -1 }} />

        <AuthProvider>
          <Navbar />
          <MobileNav />
          <ScrollbarProvider>
            <main className="flex-grow h-full">
              {children}
            </main>
          </ScrollbarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
