'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MODELS, getModel } from './data';
import { ProviderIcon } from './provider-icon';

const STAR = 'M8 1.6L9.95 5.55L14.3 6.18L11.15 9.25L11.89 13.58L8 11.53L4.11 13.58L4.85 9.25L1.7 6.18L6.05 5.55L8 1.6Z';

export function ModelSelector({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'fav' | 'all'>('all');
  const [query, setQuery] = useState('');
  const [favs, setFavs] = useState<string[]>(['claude', 'gpt']);
  const wrap = useRef<HTMLDivElement>(null);
  const current = getModel(value);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', down);
    window.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', down);
      window.removeEventListener('keydown', key);
    };
  }, [open]);

  const q = query.trim().toLowerCase();
  const list = MODELS.filter(
    (m) =>
      (tab === 'all' || favs.includes(m.id)) &&
      (!q || m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q))
  );

  const toggleFav = (id: string) =>
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          setQuery('');
        }}
        className="inline-flex h-[38px] items-center gap-2 rounded-full border border-transparent pl-1.5 pr-3 text-[15px] font-medium tracking-[-0.011em] text-[#f4f4f6] transition-colors hover:border-white/[0.075] hover:bg-white/[0.045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
      >
        <ProviderIcon model={current} size={26} />
        <span>{current.name}</span>
        <span className="hidden text-[#8e8d95] sm:inline">Planned</span>
        <svg viewBox="0 0 16 16" fill="none" className={`h-[13px] w-[13px] text-[#9e9da6] transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="scrim"
              type="button"
              tabIndex={-1}
              aria-label="Close model list"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 sm:hidden"
            />
            <motion.div
              key="panel"
              role="listbox"
              aria-label="Choose a model"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[80dvh] overflow-y-auto rounded-t-[24px] border border-white/[0.12] bg-gradient-to-br from-[#2b2b33] to-[#1f1f25] p-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_22px_48px_-10px_rgba(0,0,0,0.65)] sm:absolute sm:inset-x-auto sm:bottom-full sm:left-0 sm:mb-2 sm:max-h-[420px] sm:w-[300px] sm:rounded-[20px] sm:pb-2"
            >
              <div className="mx-auto mb-2 mt-1 h-1 w-10 rounded-full bg-white/20 sm:hidden" />

              <div className="mx-1.5 mb-1 flex h-9 items-center gap-2 rounded-lg px-2">
                <svg viewBox="0 0 16 16" fill="none" className="h-[15px] w-[15px] shrink-0 text-[#8e8d95]" aria-hidden="true">
                  <circle cx="7.2" cy="7.2" r="4.8" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.8 10.8L13.8 13.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <label htmlFor="model-search" className="sr-only">Search models</label>
                <input
                  id="model-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search models"
                  autoComplete="off"
                  className="w-full bg-transparent text-[16px] tracking-[-0.011em] text-[#f4f4f6] outline-none placeholder:text-[#8c8b93] sm:text-[14.5px]"
                />
              </div>

              <div className="mx-1.5 mb-1.5 flex items-center rounded-full border border-white/[0.06] bg-black/30 p-0.5" role="tablist" aria-label="Filter models">
                {(['fav', 'all'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={`inline-flex h-[28px] flex-1 items-center justify-center gap-1.5 rounded-full border text-[13.5px] font-medium tracking-[-0.012em] transition-colors ${
                      tab === t
                        ? 'border-white/[0.11] bg-[#2c2c35] text-[#f4f4f6] shadow-[0_2px_6px_rgba(0,0,0,0.28)]'
                        : 'border-transparent text-[#8e8d95] hover:text-[#f4f4f6]'
                    }`}
                  >
                    {t === 'fav' && (
                      <svg viewBox="0 0 16 16" className="h-3 w-3" fill={tab === 'fav' ? '#FACC15' : 'none'} stroke={tab === 'fav' ? '#FACC15' : 'currentColor'} strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
                        <path d={STAR} />
                      </svg>
                    )}
                    {t}
                    <span className="text-[11.5px] opacity-70">{t === 'fav' ? favs.length : MODELS.length}</span>
                  </button>
                ))}
              </div>

              <p className="mx-2 mb-1 text-[11.5px] leading-4 text-[#8e8d95]">
                No model is connected yet. Your choice is remembered for when providers exist.
              </p>

              <div className="flex flex-col gap-0.5">
                {list.length === 0 && (
                  <p className="px-3 py-4 text-center text-[13px] text-[#8e8d95]">
                    {tab === 'fav' ? 'No favourites yet. Open "all" and press the star.' : 'No matching models'}
                  </p>
                )}
                {list.map((m) => {
                  const selected = m.id === value;
                  const fav = favs.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      role="option"
                      aria-selected={selected}
                      className="flex items-center rounded-full pr-2 hover:bg-black/30 focus-within:bg-black/30"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onChange(m.id);
                          setOpen(false);
                        }}
                        className="flex min-h-[44px] min-w-0 flex-1 items-center gap-2.5 rounded-full py-1 pl-1.5 pr-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                      >
                        <ProviderIcon model={m} size={28} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14.5px] tracking-[-0.011em]">
                            <span className="font-medium text-[#f4f4f6]">{m.name}</span>
                            <span className="ml-1.5 text-[#8e8d95]">{m.provider}</span>
                          </span>
                          <span className="block truncate text-[11.5px] text-amber-200/80">
                            {m.status === 'planned' ? 'Planned · not connected' : 'Unavailable'}
                          </span>
                        </span>
                        {selected && (
                          <svg viewBox="0 0 16 16" fill="none" className="h-[15px] w-[15px] shrink-0 text-[#f4f4f6]" aria-hidden="true">
                            <path d="M3.2 8.5L6.5 11.8L13 4.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFav(m.id)}
                        aria-pressed={fav}
                        aria-label={`${fav ? 'Remove' : 'Add'} ${m.name} ${fav ? 'from' : 'to'} favourites`}
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 ${fav ? 'text-[#FACC15]' : 'text-[#6e6d76] hover:text-[#FACC15]'}`}
                      >
                        <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" aria-hidden="true">
                          <path d={STAR} />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}