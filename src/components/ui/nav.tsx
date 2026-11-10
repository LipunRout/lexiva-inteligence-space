'use client';

import React, { useId } from 'react';
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

  return (
    <>
      <header className="sticky top-0 z-30 h-[52px] w-full border-b-2 border-dashed border-[#f4f1ea]/25 bg-[#0A0A0C] [background-image:repeating-linear-gradient(135deg,rgba(244,241,234,0.05)_0_1px,transparent_1px_10px)]">
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

        <div className={`absolute left-1/2 top-0 flex h-[44px] w-[min(92vw,440px)] -translate-x-1/2 items-center justify-between gap-2 rounded-b-[24px] px-4 xl:hidden ${NOTCH}`}>
          <WingLeft />
          <WingRight />
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="mobile-bottom-navigation fixed inset-x-0 bottom-0 z-50 border-t-2 border-dashed border-[#f4f1ea]/25 bg-[#0A0A0C]/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur [background-image:repeating-linear-gradient(135deg,rgba(244,241,234,0.035)_0_1px,transparent_1px_10px)] xl:hidden"
      >
        <ul className="mx-auto flex max-w-[520px] items-center justify-around gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;

            return (
              <li key={link.href} className="flex-1">
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`mx-auto flex min-h-12 max-w-[96px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4f1ea] ${
                    active
                      ? 'bg-[#f4f1ea] text-[#0B0B0E]'
                      : 'text-[#f4f1ea]/60 hover:text-[#f4f1ea]'
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {link.href === '/chat' && (
                      <>
                        <path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-6a8 8 0 1 1 18-4Z" />
                        <path d="M8 10h8M8 13.5h5" />
                      </>
                    )}
                    {link.href === '/models' && (
                      <>
                        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
                      </>
                    )}
                    {link.href === '/compare' && (
                      <>
                        <rect x="3" y="4" width="7" height="16" rx="1.5" />
                        <rect x="14" y="4" width="7" height="16" rx="1.5" />
                      </>
                    )}
                    {link.href === '/history' && (
                      <>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </>
                    )}
                  </svg>
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}