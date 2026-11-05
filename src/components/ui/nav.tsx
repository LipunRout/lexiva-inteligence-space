'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, ButtonLink } from './button';

const links = [
  { label: 'Chat', href: '/chat' },
  { label: 'Models', href: '/models' },
  { label: 'Compare', href: '/compare' },
  { label: 'History', href: '/history' },
];

export function HeaderNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#EEEAF4] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Lexiva home"
          className="inline-flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7468EB]"
        >
          <Image
            src="/lexiva-mark.png"
            alt=""
            aria-hidden="true"
            width={840}
            height={768}
            priority
            className="h-10 w-10 object-contain sm:h-11 sm:w-11"
          />
          <span className="flex flex-col">
            <span className="text-[18px] font-semibold leading-5 tracking-[-0.05em] text-[#29263A]">
              Lexiva
            </span>
            <span className="text-[8px] font-semibold uppercase leading-3 tracking-[0.16em] text-[#777582]">
              Intelligence Space
            </span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-[13px] font-medium text-[#555360] transition-colors hover:text-[#6559DB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7468EB]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#workflow"
            className="hidden min-h-11 items-center px-3 text-[13px] font-medium text-[#555360] transition-colors hover:text-[#6559DB] sm:inline-flex"
          >
            How it works
          </Link>
          <ButtonLink
            href="/chat"
            className="hidden !min-h-[40px] !rounded-xl !px-4 !py-1.5 !text-[13px] sm:inline-flex"
          >
            Start a chat
          </ButtonLink>
          <Button
            variant="icon"
            className="!text-[#29263A] md:hidden"
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
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-[#EEEAF4] bg-white px-4 py-3 md:hidden"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex min-h-11 items-center text-[14px] font-medium text-[#555360] hover:text-[#6559DB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7468EB]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#workflow"
              onClick={closeMenu}
              className="flex min-h-11 items-center text-[14px] font-medium text-[#555360]"
            >
              How it works
            </Link>
            <ButtonLink
              href="/chat"
              onClick={closeMenu}
              className="mt-2 !rounded-xl"
            >
              Start a chat
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  );
}
