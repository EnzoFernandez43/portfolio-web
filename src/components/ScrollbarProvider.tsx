'use client';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

export default function ScrollbarProvider({ children }: { children: React.ReactNode }) {
  return (
    <OverlayScrollbarsComponent
      element="div"
      style={{ height: '100vh', width: '100%' }}
      options={{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-light' } }}
      defer
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}