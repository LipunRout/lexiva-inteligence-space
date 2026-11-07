'use client';

import React, { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  function toggle() {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('lexiva-theme', next);
    } catch {
      /* storage unavailable: theme still applies for this visit */
    }
    setTheme(next);
  }

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isLight}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#f4f1ea]/60 text-[#f4f1ea] transition-transform duration-150 hover:-rotate-12 hover:border-[#f4f1ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[#f4f1ea] motion-reduce:transition-none ${className}`}
    >
      {isLight ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}