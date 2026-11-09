'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

export interface MenuItem {
  label: string;
  onSelect: () => void;
  danger?: boolean;
}

export function ActionMenu({
  items,
  label,
  className = '',
}: {
  items: MenuItem[];
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  function toggle() {
    if (open) return setOpen(false);
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    const height = items.length * 40 + 12;
    const top = r.bottom + 6 + height > window.innerHeight ? r.top - height - 6 : r.bottom + 6;
    setPos({ top: Math.max(8, top), left: Math.max(8, Math.min(r.right - 180, window.innerWidth - 188)) });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const down = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menu.current?.contains(t) || btn.current?.contains(t)) return;
      close();
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('mousedown', down);
    window.addEventListener('keydown', key);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('mousedown', down);
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={toggle}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6F73F7] ${className}`}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <circle cx="4" cy="10" r="1.6" />
          <circle cx="10" cy="10" r="1.6" />
          <circle cx="16" cy="10" r="1.6" />
        </svg>
      </button>
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.div
                ref={menu}
                role="menu"
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.12 }}
                style={{ position: 'fixed', top: pos.top, left: pos.left, width: 180 }}
                className="z-[80] rounded-xl border border-white/[0.12] bg-[#020E2D] p-1.5 text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)]"
              >
                {items.map((it) => (
                  <button
                    key={it.label}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      it.onSelect();
                    }}
                    className={`flex h-10 w-full items-center rounded-lg px-3 text-left text-[14px] hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none ${
                      it.danger ? 'text-rose-300' : 'text-white/85'
                    }`}
                  >
                    {it.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}