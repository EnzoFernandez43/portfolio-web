import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Importamos tu Navbar
import ScrollbarProvider from '@/components/ScrollbarProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enzo Fernandez | Portfolio Full-Stack", // Ajusta el título
  description: "Portfolio profesional de Enzo Fernandez, Ingeniero en Sistemas y desarrollador Full-Stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Cambiamos lang a "es"
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-hidden">
        <ScrollbarProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </ScrollbarProvider>
      </body>
    </html>
  );
}