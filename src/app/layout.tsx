import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { HeaderNav } from '@/components/ui/nav';
import { SiteFooter } from '@/components/ui/site-footer';
import { RouteProgress } from '@/components/ui/route-progress';
import { ChromeGate } from '@/components/ui/chrome-gate';
import './globals.scss';
import './tailwind.css';

export const metadata: Metadata = {
  applicationName: 'Lexiva Intelligence Space',
  title: 'Lexiva Intelligence Space',
  description: 'One space to chat with multiple AI models and see which model powers every response.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Lexiva',
  },
  icons: {
    icon: [
      { url: '/icons/lexiva-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/lexiva-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/lexiva-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#030303',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('lexiva-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className="overflow-x-hidden bg-[#030303]">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-[100svh] bg-[#030303] text-white antialiased">
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <ChromeGate>
          <HeaderNav />
        </ChromeGate>
        {children}
        <ChromeGate>
          <SiteFooter />
        </ChromeGate>
        <ChromeGate>
          <div aria-hidden="true" className="h-[calc(68px+env(safe-area-inset-bottom))] xl:hidden" />
        </ChromeGate>
      </body>
    </html>
  );
}