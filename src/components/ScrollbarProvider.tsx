'use client';

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';

export default function ScrollbarProvider({ children }: { children: React.ReactNode }) {
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