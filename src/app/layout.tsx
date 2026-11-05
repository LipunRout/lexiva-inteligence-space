import type { Metadata } from 'next';
import { HeaderNav } from '@/components/ui/nav';
import { SiteFooter } from '@/components/ui/site-footer';
import './globals.scss';
import './tailwind.css';

export const metadata: Metadata = {
  title: 'Lexiva Intelligence Space',
  description: 'One space to chat with multiple AI models and see which model powers every response.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HeaderNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
