'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutGroup, motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const LINKS = [
  { label: 'Chat', href: '/chat' },
  { label: 'Models', href: '/models' },
  { label: 'Compare', href: '/compare' },
  { label: 'History', href: '/history' },
];

const NOTCH = 'bg-[#17171d] text-[#f4f1ea]';
const WING = 'pointer-events-none absolute top-0 h-4 w-4 overflow-visible text-[#17171d]';

function WingLeft() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={`${WING} right-full`}>
      <path d="M 0 0 C 11.046 0 20 8.954 20 20 H 21 V -1 H 0 Z" fill="currentColor" />
    </svg>
  );
}
function WingRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={`${WING} left-full`}>
      <path d="M 20 0 C 8.954 0 0 8.954 0 20 H -1 V -1 H 20 Z" fill="currentColor" />
    </svg>
  );
}

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Lexiva home"
      className="inline-flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-4 focus-visible:outline-[#f4f1ea]"
    >
      <Image
        src="/lexiva-mark.png"
        alt=""
        aria-hidden="true"
        width={840}
        height={768}
        priority
        className="h-8 w-8 object-contain"
      />
      <span className="flex flex-col">
        <span className="text-[16px] font-semibold leading-4 tracking-[-0.04em] text-[#f4f1ea]">Lexiva</span>
        <span className="text-[7px] font-semibold uppercase leading-3 tracking-[0.16em] text-[#a5b4fc]">
          Intelligence Space
        </span>
      </span>
    </Link>
  );
}

function StartButton({ onClick, className = '' }: { onClick?: () => void; className?: string }) {
  return (
    <Link
      href="/chat"
      onClick={onClick}
      className={`inline-flex h-8 items-center justify-center rounded-full border-2 border-[#f4f1ea] bg-[#f4f1ea] px-4 text-[13px] font-bold text-[#0B0B0E] shadow-[0_2px_0_#a5b4fc] transition-transform duration-150 hover:-translate-y-0.5 hover:-rotate-1 active:translate-y-0.5 active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-4 focus-visible:outline-[#f4f1ea] motion-reduce:transition-none ${className}`}
    >
      Start a chat
    </Link>
  );
}

export function HeaderNav() {
  const pathname = usePathname();
  const group = useId();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const current = LINKS.find((l) => l.href === pathname);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 h-[52px] w-full border-b-2 border-dashed border-[#f4f1ea]/25 bg-[#0A0A0C] [background-image:repeating-linear-gradient(135deg,rgba(244,241,234,0.05)_0_1px,transparent_1px_10px)]">
      {/* Desktop (xl and up): three notches */}
      <div className="hidden xl:block">
        <div className={`absolute left-0 top-0 flex h-[44px] items-center rounded-br-[24px] px-6 ${NOTCH}`}>
          <Logo />
          <WingRight />
        </div>

        <nav
          aria-label="Main navigation"
          className={`absolute left-1/2 top-0 flex h-[44px] -translate-x-1/2 items-center rounded-b-[24px] px-4 ${NOTCH}`}
        >
          <WingLeft />
          <WingRight />
          <LayoutGroup id={group}>
            <ul className="flex items-center gap-1">
              {LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative flex h-9 items-center rounded-full px-4 text-[14px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[#f4f1ea] ${
                        active ? 'font-bold text-[#0B0B0E]' : 'text-[#f4f1ea]/65 hover:text-[#f4f1ea]'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="notch-active"
                          className="absolute inset-0 rounded-full bg-[#f4f1ea]"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 leading-none">{l.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>

        <div className={`absolute right-0 top-0 flex h-[44px] items-center gap-3 rounded-bl-[24px] px-6 ${NOTCH}`}>
          <WingLeft />
          <Link
            href="/#workflow"
            className="inline-flex h-9 items-center px-2 text-[13px] font-medium text-[#f4f1ea]/65 hover:text-[#f4f1ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[#f4f1ea]"
          >
            How it works
          </Link>
          <ThemeToggle />
          <StartButton />
        </div>
      </div>

      {/* Tablet and mobile (below xl): one compact notch */}
      <div
        ref={box}
        className={`absolute left-1/2 top-0 w-[min(92vw,440px)] -translate-x-1/2 rounded-b-[24px] px-4 xl:hidden ${NOTCH}`}
      >
        <WingLeft />
        <WingRight />

        <div className="flex h-[44px] items-center justify-between gap-2">
          <Logo onClick={() => setOpen(false)} />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setOpen((o) => !o)}
              className="inline-flex h-9 items-center gap-2 rounded-full border-2 border-[#f4f1ea]/60 px-3 text-[13px] font-semibold text-[#f4f1ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[#f4f1ea]"
            >
              <span>{current ? current.label : 'Menu'}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className={`h-3.5 w-3.5 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
              >
                <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
            open ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1 pb-3 pt-1">
              {LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    tabIndex={open ? 0 : -1}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-11 items-center justify-between rounded-xl px-3 text-[15px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-[#f4f1ea] ${
                      active ? 'bg-[#f4f1ea] font-bold text-[#0B0B0E]' : 'text-[#f4f1ea]/75'
                    }`}
                  >
                    {l.label}
                    {active && (
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                        <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </Link>
                );
              })}
              <Link
                href="/#workflow"
                tabIndex={open ? 0 : -1}
                className="flex min-h-11 items-center rounded-xl px-3 text-[15px] font-medium text-[#f4f1ea]/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-[#f4f1ea]"
              >
                How it works
              </Link>
              <StartButton className="mt-2 !h-11 w-full !text-[14px]" />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}