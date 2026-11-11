import { HeaderNav } from './nav';
import { SiteFooter } from './site-footer';
import { ChromeGate } from './chrome-gate';

export function AppChrome() {
  return (
    <ChromeGate>
      <HeaderNav />
    </ChromeGate>
  );
}

export function AppFooter() {
  return (
    <>
      <ChromeGate>
        <SiteFooter />
      </ChromeGate>
      <ChromeGate>
        <div aria-hidden="true" className="h-[calc(68px+env(safe-area-inset-bottom))] xl:hidden" />
      </ChromeGate>
    </>
  );
}
