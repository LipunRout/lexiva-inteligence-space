'use client';

import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const COLUMNS = [
  {
    title: 'Workspace',
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
];

const STATUS: { label: string; state: 'preview' | 'planned' | 'off' }[] = [
  { label: 'Chat workspace', state: 'preview' },
  { label: 'Model providers', state: 'planned' },
  { label: 'Side-by-side compare', state: 'planned' },
  { label: 'Saved history', state: 'planned' },
  { label: 'File context', state: 'planned' },
];

const STATE_STYLE = {
  preview: { dot: 'bg-emerald-400', text: 'text-emerald-300', label: 'Local preview' },
  planned: { dot: 'bg-amber-300', text: 'text-amber-200', label: 'Planned' },
  off: { dot: 'bg-white/30', text: 'text-white/50', label: 'Off' },
};

const JUMPS = [
  { keys: ['chat', 'talk', 'ask'], href: '/chat', label: 'Chat' },
  { keys: ['model', 'provider'], href: '/models', label: 'Models' },
  { keys: ['compare', 'side'], href: '/compare', label: 'Compare' },
  { keys: ['history', 'saved', 'past'], href: '/history', label: 'History' },
  { keys: ['home', 'start'], href: '/', label: 'Home' },
];

export function SiteFooter() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [miss, setMiss] = useState(false);

  function go(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const s = q.trim().toLowerCase();
    if (!s) return;
    const hit = JUMPS.find((j) => j.keys.some((k) => s.includes(k)));
    if (hit) {
      setMiss(false);
      setQ('');
      router.push(hit.href);
    } else {
      setMiss(true);
    }
  }

  return (
    <footer className="relative w-full overflow-hidden border-t border-white/[0.08] bg-[#050508] text-white">
      {/* Ambient glow + grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-[320px] w-[min(480px,100%)] rounded-full bg-indigo-500/15 blur-[110px]" />
        <div className="absolute -right-24 bottom-0 h-[320px] w-[min(480px,100%)] rounded-full bg-rose-500/12 blur-[110px]" />
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,#000_20%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 pb-8 pt-14 sm:pt-20">
        {/* Top: prompt bar */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-indigo-400 to-rose-400" />
              Your AI workspace
            </p>
            <h2 className="text-[34px] font-medium leading-[1.05] tracking-[-0.055em] sm:text-[52px]">
              Think with every model,{' '}
              <span className="hero-gradient">in one space.</span>
            </h2>
          </div>

          <form onSubmit={go} className="w-full">
            <label htmlFor="footer-jump" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Jump to
            </label>
            <div className="flex items-center gap-2 rounded-[18px] border border-white/[0.14] bg-white/[0.04] p-2 focus-within:border-indigo-300/60 focus-within:ring-2 focus-within:ring-indigo-300/20">
              <span aria-hidden="true" className="pl-3 font-mono text-[14px] text-indigo-300">
                /
              </span>
              <input
                id="footer-jump"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setMiss(false);
                }}
                placeholder="chat, models, compare, history"
                autoComplete="off"
                className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/30"
              />
              <button
                type="submit"
                aria-label="Go"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-r from-indigo-400 to-rose-400 text-[#0E0D14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p role="status" className="mt-2 min-h-[18px] text-[12px] text-white/45">
              {miss ? 'No match. Try chat, models, compare or history.' : ''}
            </p>
          </form>
        </div>

        {/* Middle: status board + links */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <section
            aria-label="Workspace status"
            className="rounded-[24px] border border-white/[0.1] bg-black/40 p-5 backdrop-blur sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                workspace.status
              </h3>
              <span className="font-mono text-[11px] text-white/35">prototype build</span>
            </div>
            <ul className="divide-y divide-white/[0.06]">
              {STATUS.map((s) => {
                const st = STATE_STYLE[s.state];
                return (
                  <li key={s.label} className="flex items-center justify-between gap-3 py-3">
                    <span className="text-[15px] text-white/85">{s.label}</span>
                    <span className={`inline-flex items-center gap-2 font-mono text-[11.5px] ${st.text}`}>
                      <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-[12.5px] leading-[1.5] text-white/45">
              No AI provider is connected yet. Statuses update as features are really built.
            </p>
          </section>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-6 rounded-[24px] border border-white/[0.1] bg-white/[0.03] p-5 sm:p-6">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-indigo-300">
                  {col.title}
                </h3>
                <ul className="space-y-1">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="inline-flex min-h-10 items-center gap-2 text-[16px] font-medium text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
                      >
                        <span aria-hidden="true" className="text-indigo-300/70">
                          ↳
                        </span>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Wordmark */}
        <div aria-hidden="true" className="mt-14 select-none overflow-hidden">
          <p className="hero-gradient text-center text-[clamp(64px,19vw,240px)] font-semibold leading-[0.9] tracking-[-0.06em] opacity-90">
            Lexiva
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-[12.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Lexiva Intelligence Space</p>
          <p className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Local-only conversations · No provider connected
          </p>
        </div>
      </div>
    </footer>
  );
}