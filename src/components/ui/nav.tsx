'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'Chat', href: '/chat' },
  { label: 'Models', href: '/models' },
  { label: 'Compare', href: '/compare' },
  { label: 'History', href: '/history' },
];

export function HeaderNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 bg-[#050509]/85 backdrop-blur-xl">
      {/* Colour wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/[0.18] via-violet-500/[0.08] to-rose-500/[0.18]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-24 w-72 rounded-full bg-indigo-500/25 blur-[70px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-24 w-72 rounded-full bg-rose-500/20 blur-[70px]"
      />
      {/* Gradient bottom line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-indigo-400/40 via-transparent to-rose-400/40"
      />

      <div className="relative mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Lexiva home"
          className="inline-flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
        >
          <Image
            src="/lexiva-mark.png"
            alt=""
            aria-hidden="true"
            width={512}
            height={512}
            priority
            className="h-10 w-10 object-contain sm:h-11 sm:w-11"
          />
          <span className="flex flex-col">
            <span className="text-[18px] font-semibold leading-5 tracking-[-0.05em] text-white">
              Lexiva
            </span>
            <span className="bg-gradient-to-r from-indigo-300 to-rose-300 bg-clip-text text-[8px] font-semibold uppercase leading-3 tracking-[0.16em] text-transparent">
              Intelligence Space
            </span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1.5 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`group relative inline-flex min-h-10 items-center rounded-full px-4 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${
                  active
                    ? 'bg-gradient-to-r from-indigo-400/25 to-rose-400/25 text-white ring-1 ring-white/[0.15]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                {!active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 bottom-1.5 h-px origin-left scale-x-0 bg-gradient-to-r from-indigo-300 to-rose-300 transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#workflow"
            className="hidden min-h-11 items-center px-3 text-[13px] font-medium text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300 sm:inline-flex"
          >
            How it works
          </Link>
          <Link
            href="/chat"
            className="hidden h-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400 px-5 text-[13px] font-semibold text-[#0E0D14] shadow-[0_8px_24px_-8px_rgba(167,139,250,0.7)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 sm:inline-flex"
          >
            Start a chat
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.06] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 md:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="relative border-t border-white/[0.08] bg-gradient-to-b from-[#0B0B14] to-[#0E0A12] px-4 py-3 md:hidden"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-11 items-center rounded-xl px-3 text-[15px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300 ${
                    active
                      ? 'bg-gradient-to-r from-indigo-400/20 to-rose-400/20 text-white'
                      : 'text-white/75'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/#workflow"
              onClick={closeMenu}
              className="flex min-h-11 items-center px-3 text-[15px] font-medium text-white/75"
            >
              How it works
            </Link>
            <Link
              href="/chat"
              onClick={closeMenu}
              className="mt-3 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400 text-[14px] font-semibold text-[#0E0D14]"
            >
              Start a chat
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}