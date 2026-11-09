'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getModel } from './data';
import { useModels } from './use-models';
import { ProviderIcon } from './provider-icon';
import type { ModelInfo } from './types';

const STAR = 'M8 1.6L9.95 5.55L14.3 6.18L11.15 9.25L11.89 13.58L8 11.53L4.11 13.58L4.85 9.25L1.7 6.18L6.05 5.55L8 1.6Z';
const FAV_KEY = 'lexiva:favs';

export function ModelSelector({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { models, loading } = useModels();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all'); // 'all' | 'fav' | provider name
  const [favs, setFavs] = useState<string[]>([]);
  const current = getModel(value);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(FAV_KEY);
      if (saved) setFavs(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const providers = useMemo(() => Array.from(new Set(models.map((m) => m.provider))), [models]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = models.filter(
      (m) =>
        (filter === 'all' || (filter === 'fav' ? favs.includes(m.id) : m.provider === filter)) &&
        (!q || m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q) || m.id.toLowerCase().includes(q))
    );
    const map = new Map<string, ModelInfo[]>();
    list.forEach((m) => map.set(m.provider, [...(map.get(m.provider) ?? []), m]));
    return Array.from(map.entries());
  }, [models, filter, query, favs]);

  const toggleFav = (id: string) =>
    setFavs((f) => {
      const next = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  const close = () => setOpen(false);

  const chip = (active: boolean) =>
    `inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 ${
      active
        ? 'border-white/[0.2] bg-[#f4f4f6] text-[#18181c]'
        : 'border-white/[0.1] bg-white/[0.04] text-[#c9c8cf] hover:bg-white/[0.08]'
    }`;

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setQuery('');
          setOpen(true);
        }}
        className="inline-flex h-[38px] max-w-[220px] items-center gap-2 rounded-full border border-transparent pl-1.5 pr-3 text-[15px] font-medium tracking-[-0.011em] text-[#f4f4f6] transition-colors hover:border-white/[0.075] hover:bg-white/[0.045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
      >
        <ProviderIcon model={current} size={26} />
        <span className="truncate">{loading ? 'Loading...' : current.name}</span>
        <svg viewBox="0 0 16 16" fill="none" className="h-[13px] w-[13px] shrink-0 text-[#9e9da6]" aria-hidden="true">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="models-dialog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
              >
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Close model picker"
                  onClick={close}
                  className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
                />

                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Choose a model"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-[24px] border border-white/[0.1] bg-[#1b1b20] shadow-[0_30px_70px_-12px_rgba(0,0,0,0.75)] sm:h-[min(580px,82dvh)] sm:max-w-[520px] sm:rounded-[24px]"
                >
                  <div className="flex items-center justify-between px-5 pb-2 pt-4">
                    <h2 className="text-[16px] font-semibold tracking-[-0.011em] text-[#f4f4f6]">Choose a model</h2>
                    <button
                      type="button"
                      onClick={close}
                      aria-label="Close"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#9e9da6] hover:bg-white/[0.07] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                    >
                      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  <div className="px-4 pb-2">
                    <div className="flex h-11 items-center gap-2 rounded-xl border border-white/[0.08] bg-black/30 px-3 focus-within:border-white/25">
                      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 shrink-0 text-[#8e8d95]" aria-hidden="true">
                        <circle cx="7.2" cy="7.2" r="4.8" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10.8 10.8L13.8 13.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <label htmlFor="model-search" className="sr-only">Search models</label>
                      <input
                        id="model-search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search models or providers"
                        autoComplete="off"
                        className="w-full bg-transparent text-[16px] text-[#f4f4f6] outline-none placeholder:text-[#8c8b93] sm:text-[14.5px]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 [scrollbar-width:none]" role="group" aria-label="Filter by provider">
                    <button type="button" onClick={() => setFilter('all')} aria-pressed={filter === 'all'} className={chip(filter === 'all')}>
                      All <span className="opacity-60">{models.length}</span>
                    </button>
                    <button type="button" onClick={() => setFilter('fav')} aria-pressed={filter === 'fav'} className={chip(filter === 'fav')}>
                      <svg viewBox="0 0 16 16" className="h-3 w-3" fill={filter === 'fav' ? '#18181c' : 'none'} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
                        <path d={STAR} />
                      </svg>
                      Favorites
                    </button>
                    {providers.map((p) => (
                      <button key={p} type="button" onClick={() => setFilter(p)} aria-pressed={filter === p} className={chip(filter === p)}>
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto border-t border-white/[0.06] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    {loading && <p className="px-5 py-8 text-center text-[13.5px] text-[#8e8d95]">Loading models...</p>}

                    {!loading && models.length === 0 && (
                      <p className="px-5 py-8 text-center text-[13.5px] leading-5 text-[#8e8d95]">
                        No providers are configured. Add an API key to <code>.env.local</code> and restart the server.
                      </p>
                    )}

                    {!loading && models.length > 0 && groups.length === 0 && (
                      <p className="px-5 py-8 text-center text-[13.5px] text-[#8e8d95]">
                        {filter === 'fav' ? 'No favorites yet. Tap a star next to any model.' : 'No matching models'}
                      </p>
                    )}

                    {groups.map(([provider, list]) => (
                      <section key={provider} aria-label={provider}>
                        <h3 className="sticky top-0 z-10 flex items-center gap-2 bg-[#1b1b20]/95 px-5 py-2 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#8e8d95] backdrop-blur">
                          <span className="h-2 w-2 rounded-full" style={{ background: list[0].color }} />
                          {provider}
                          <span className="font-normal opacity-60">{list.length}</span>
                        </h3>
                        <ul>
                          {list.map((m) => {
                            const selected = m.id === value;
                            const fav = favs.includes(m.id);
                            const apiName = m.id.includes(':') ? m.id.split(':').slice(1).join(':') : m.id;
                            return (
                              <li key={m.id} className={`mx-2 flex items-center rounded-xl ${selected ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'}`}>
                                <button
                                  type="button"
                                  aria-current={selected}
                                  onClick={() => {
                                    onChange(m.id);
                                    close();
                                  }}
                                  className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 rounded-xl py-2 pl-3 pr-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                                >
                                  <ProviderIcon model={m} size={32} />
                                  <span className="min-w-0 flex-1">
                                    <span className="block break-words text-[15px] font-medium leading-5 tracking-[-0.011em] text-[#f4f4f6]">
                                      {m.name}
                                    </span>
                                    <span className="mt-0.5 block truncate font-mono text-[11.5px] text-[#8e8d95]">{apiName}</span>
                                  </span>
                                  {selected && (
                                    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 shrink-0 text-[#f4f4f6]" aria-hidden="true">
                                      <path d="M3.2 8.5L6.5 11.8L13 4.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleFav(m.id)}
                                  aria-pressed={fav}
                                  aria-label={`${fav ? 'Remove' : 'Add'} ${m.name} ${fav ? 'from' : 'to'} favorites`}
                                  className={`mr-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 ${
                                    fav ? 'text-[#FACC15]' : 'text-[#6e6d76] hover:text-[#FACC15]'
                                  }`}
                                >
                                  <svg viewBox="0 0 16 16" className="h-[15px] w-[15px]" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" aria-hidden="true">
                                    <path d={STAR} />
                                  </svg>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}