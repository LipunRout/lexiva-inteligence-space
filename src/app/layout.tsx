import type { Metadata, Viewport } from 'next';
import { HeaderNav } from '@/components/ui/nav';
import { SiteFooter } from '@/components/ui/site-footer';
import './globals.scss';
import './tailwind.css';

export const metadata: Metadata = {
  title: 'Lexiva Intelligence Space',
  description: 'One space to chat with multiple AI models and see which model powers every response.',
};

export const viewport: Viewport = {
  themeColor: '#030303',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#030303]">
      <body className="min-h-screen bg-[#030303] text-white antialiased">
        <HeaderNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}