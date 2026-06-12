'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderOpen, User, Mail } from 'lucide-react';

const links = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/proyectos', label: 'Proyectos', icon: FolderOpen },
  { href: '/sobre-mi', label: 'Sobre mí', icon: User },
  { href: '/contacto', label: 'Contacto', icon: Mail },
];

export default function MobileNav() {
  const pathname = usePathname();
  const hidden = pathname.startsWith('/detalleproyecto/');
  if (hidden) return null;

  return (
    <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm">
      <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl px-2 py-2 flex items-center justify-around"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,92,0,0.08)' }}>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${active ? 'bg-[#FF5C00]/15' : 'hover:bg-white/5'}`}>
              <Icon size={20} className={active ? 'text-[#FF5C00]' : 'text-gray-400'} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${active ? 'text-[#FF5C00]' : 'text-gray-500'}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
