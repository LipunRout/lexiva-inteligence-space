'use client';

import { usePathname } from 'next/navigation';
import { HeaderNav } from './nav';
import { SiteFooter } from './site-footer';
import { ChromeGate } from './chrome-gate';

export function AppChrome() {
  const pathname = usePathname();
  const isChatRoute = pathname === '/chat' || pathname.startsWith('/chat/');

  if (isChatRoute) return null;

  return (
    <>
      <ChromeGate>
        <HeaderNav />
      </ChromeGate>
      <ChromeGate>
        <SiteFooter />
      </ChromeGate>
      <ChromeGate>
        <div aria-hidden="true" className="h-[calc(68px+env(safe-area-inset-bottom))] xl:hidden" />
      </ChromeGate>
    </>
  );
}
