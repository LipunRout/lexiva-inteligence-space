import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Chat', href: '/chat' },
      { label: 'Models', href: '/models' },
      { label: 'Compare', href: '/compare' },
      { label: 'History', href: '/history' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Why Lexiva', href: '/#about' },
      { label: 'How it works', href: '/#workflow' },
    ],
  },
  {
    title: 'Status',
    links: [
      { label: 'Provider setup', href: '/models' },
      { label: 'Prototype notes', href: '/#about' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#0B0B0E] px-4 pb-10 pt-16 text-white">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link
              href="/"
              aria-label="Lexiva Intelligence Space home"
              className="inline-flex items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
            >
              <Image
                src="/lexiva-mark.png"
                alt=""
                aria-hidden="true"
                width={512}
                height={512}
                className="h-11 w-11 object-contain"
              />
              <span>
                <span className="block text-[22px] font-semibold tracking-[-0.04em]">
                  Lexiva
                </span>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.18em] text-white/45">
                  Intelligence Space
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-[320px] text-[15px] leading-[1.6] text-white/55">
              Multiple AI models. One intelligent space. This is a prototype: no AI provider is
              connected yet.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-indigo-300">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[16px] font-medium text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Lexiva. All rights reserved.</p>
          <p>Prototype build · Local-only conversations · No provider connected</p>
        </div>
      </div>
    </footer>
  );
}