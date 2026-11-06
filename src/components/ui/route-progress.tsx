'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function RouteProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);

  function start() {
    if (timer.current) window.clearInterval(timer.current);
    setVisible(true);
    setWidth(12);
    timer.current = window.setInterval(() => {
      setWidth((w) => (w < 85 ? w + (90 - w) * 0.08 : w));
    }, 200);
  }

  function done() {
    if (timer.current) window.clearInterval(timer.current);
    setWidth(100);
    window.setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 250);
  }

  // Route finished changing
  useEffect(() => {
    done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  // Route starting to change: any internal link click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      if (timer.current) window.clearInterval(timer.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms' }}
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-300 via-violet-300 to-rose-300 shadow-[0_0_12px_rgba(167,139,250,0.8)]"
        style={{ width: `${width}%`, transition: 'width 200ms ease-out' }}
      />
    </div>
  );
}