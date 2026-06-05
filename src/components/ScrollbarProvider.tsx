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

      const routes = ['/', '/proyectos', '/sobre-mi', '/contacto'];
      let isNavigating = false;

      const wheelHandler = (e: WheelEvent) => {
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
        const atTop = el.scrollTop <= 10;

        const currentPath = window.location.pathname;
        const currentIndex = routes.indexOf(currentPath);

        if (isNavigating) return;

        if (e.deltaY > 0 && atBottom && currentIndex < routes.length - 1) {
          isNavigating = true;
          window.location.href = routes[currentIndex + 1];
        } else if (e.deltaY < 0 && atTop && currentIndex > 0) {
          isNavigating = true;
          window.location.href = routes[currentIndex - 1];
        }
      };

      el.addEventListener('wheel', wheelHandler, { passive: true });

      return () => {
        el.removeEventListener('scroll', handler);
        el.removeEventListener('wheel', wheelHandler);
      };
    }, 500);

    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: 'relative', flex: '1 1 0' }}>
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