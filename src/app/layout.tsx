import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { HeaderNav } from '@/components/ui/nav';
import { SiteFooter } from '@/components/ui/site-footer';
import { RouteProgress } from '@/components/ui/route-progress';
import './globals.scss';
import './tailwind.css';

export const metadata: Metadata = {
  title: 'Lexiva Intelligence Space',
  description: 'One space to chat with multiple AI models and see which model powers every response.',
};

export const viewport: Viewport = {
  themeColor: '#030303',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

// Runs before first paint so there is no flash of the wrong theme.
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
      <body className="min-h-screen bg-[#030303] text-white antialiased">
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <HeaderNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}