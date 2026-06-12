'use client';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import { useEffect } from 'react';

export default function ScrollbarProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement;
      if (!el) return;

      const handler = () => {
        window.dispatchEvent(new CustomEvent('app-scroll', { detail: { scrollTop: el.scrollTop } }));
      };
      el.addEventListener('scroll', handler);

      return () => {
        el.removeEventListener('scroll', handler);
      };
    }, 500);

    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: 'relative', flex: '1 1 0', background: 'transparent' }}>
      <OverlayScrollbarsComponent
        element="div"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-light' } }}
        defer
      >
        {children}
      </OverlayScrollbarsComponent>
    </div>
  );
}