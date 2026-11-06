'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const ROW_A = [
  { name: 'GPT', dot: 'from-emerald-300 to-teal-400' },
  { name: 'Claude', dot: 'from-amber-300 to-orange-400' },
  { name: 'Gemini', dot: 'from-indigo-300 to-violet-400' },
  { name: 'Groq', dot: 'from-orange-300 to-red-400' },
  { name: 'Mistral', dot: 'from-yellow-300 to-orange-400' },
  { name: 'Llama', dot: 'from-sky-300 to-blue-400' },
  { name: 'DeepSeek', dot: 'from-blue-300 to-indigo-400' },
  { name: 'Qwen', dot: 'from-violet-300 to-fuchsia-400' },
];

const ROW_B = [
  { name: 'Gemma', dot: 'from-cyan-300 to-sky-400' },
  { name: 'Cohere', dot: 'from-rose-300 to-pink-400' },
  { name: 'Perplexity', dot: 'from-teal-300 to-cyan-400' },
  { name: 'OpenRouter', dot: 'from-fuchsia-300 to-purple-400' },
  { name: 'Together AI', dot: 'from-lime-300 to-emerald-400' },
  { name: 'Hugging Face', dot: 'from-yellow-200 to-amber-400' },
  { name: 'Ollama', dot: 'from-zinc-200 to-zinc-400' },
  { name: 'More models', dot: 'from-rose-300 to-indigo-400' },
];

const ITEMS = [
  {
    title: 'One space, many models',
    body: 'Bring supported AI models into a single conversation space instead of jumping between separate interfaces.',
  },
  {
    title: 'Clear model attribution',
    body: 'Every response is labelled with the model that produced it, so you always know where an answer came from.',
  },
  {
    title: 'Context that stays with you',
    body: 'Return to earlier conversations and continue exploring from where you left off.',
  },
];

const MARQUEE_CSS = `
@keyframes pv-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes pv-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
.pv-track-l { animation: pv-left 40s linear infinite; }
.pv-track-r { animation: pv-right 46s linear infinite; }
.pv-viewport:hover .pv-track-l,
.pv-viewport:hover .pv-track-r { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .pv-track-l, .pv-track-r { animation: none; } }
`;

function MarqueeRow({
  items,
  direction,
}: {
  items: { name: string; dot: string }[];
  direction: 'l' | 'r';
}) {
  return (
    <div className={`pv-track-${direction} flex w-max items-center`}>
      {[0, 1].map((copy) => (
        <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-3 pr-3">
          {items.map((p) => (
            <li
              key={p.name}
              className="flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] py-2 pl-3 pr-4 backdrop-blur"
            >
              <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${p.dot}`} />
              <span className="whitespace-nowrap text-[18px] font-semibold tracking-[-0.04em] text-white/80 sm:text-[20px]">
                {p.name}
              </span>
              <span className="rounded-full border border-white/[0.12] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                Planned
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export function Intelligence() {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section className="relative bg-[#030303]">
      <style>{MARQUEE_CSS}</style>

      {/* ---------- Running provider strip (two rows) ---------- */}
      <div className="relative border-y border-white/[0.08] bg-gradient-to-r from-indigo-500/[0.06] via-white/[0.02] to-rose-500/[0.06]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-4 py-6 lg:flex-row lg:items-center lg:gap-10">
          <div className="shrink-0 lg:w-[300px]">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-300/60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-300" />
              </span>
              Planned integrations
            </p>
            <h2 className="mt-2 text-[20px] font-medium leading-[1.2] tracking-[-0.03em] text-white">
              Designed for many model providers
            </h2>
            <p className="mt-1 text-[12px] leading-[1.5] text-white/45">
              No provider is connected in this prototype yet.
            </p>
          </div>

          <div
            className="pv-viewport relative min-w-0 flex-1 space-y-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]"
            role="group"
            aria-label="Planned model providers"
          >
            <MarqueeRow items={ROW_A} direction="l" />
            <MarqueeRow items={ROW_B} direction="r" />
          </div>
        </div>
      </div>

      <div className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="max-w-[760px] text-[40px] font-medium leading-[1.02] tracking-[-0.055em] text-white sm:text-[60px] lg:text-[72px]">
            AI that works the way your{' '}
            <span className="hero-gradient">conversation</span> works
          </h2>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#070709] p-6 shadow-[0_30px_80px_-30px_rgba(129,140,248,0.35)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-60 [background-size:22px_22px] [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_85%)]"
              />
              <span className="relative z-10 inline-flex rounded-full border border-white/[0.12] bg-white/[0.05] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">
                Concept preview
              </span>
              <GraphSvg reduce={!!reduce} />
            </div>

            <div className="self-center border-t border-white/[0.12]">
              {ITEMS.map((item, i) => {
                const active = open === i;
                return (
                  <div key={item.title} className="border-b border-white/[0.12]">
                    <button
                      type="button"
                      aria-expanded={active}
                      onClick={() => setOpen(active ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 py-6 text-left"
                    >
                      <span className="text-[22px] font-medium tracking-[-0.03em] text-white">
                        {item.title}
                      </span>
                      <span
                        className={clsx(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.05] text-white transition-transform duration-300 motion-reduce:transition-none',
                          active && 'rotate-180'
                        )}
                      >
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                          <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.div
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 text-[17px] leading-[1.6] text-white/60">{item.body}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GraphSvg({ reduce }: { reduce: boolean }) {
  const lines = [
    'M120 200 C 200 200, 220 90, 320 90',
    'M120 200 C 200 200, 240 200, 320 200',
    'M120 200 C 200 200, 220 310, 320 310',
    'M320 90 C 400 90, 420 200, 500 200',
    'M320 200 L 500 200',
    'M320 310 C 400 310, 420 200, 500 200',
  ];
  const nodes = [
    { x: 120, y: 200, label: 'Prompt', c: '#A5B4FC' },
    { x: 320, y: 90, label: 'Model A', c: '#D8B4FE' },
    { x: 320, y: 200, label: 'Model B', c: '#FDA4AF' },
    { x: 320, y: 310, label: 'Model C', c: '#FCD34D' },
    { x: 500, y: 200, label: 'Compare', c: '#67E8F9' },
  ];
  return (
    <svg viewBox="0 0 620 400" className="relative z-10 mt-2 h-auto w-full" role="img" aria-label="Concept diagram: one prompt sent to several models and compared">
      <g fill="none" stroke="rgba(165,180,252,0.5)" strokeWidth="1.4">
        {lines.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: i * 0.12 }}
          />
        ))}
      </g>
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="26" fill="#0B0B10" stroke={n.c} strokeWidth="1.5" />
          <circle cx={n.x} cy={n.y} r="7" fill={n.c} />
          <text x={n.x} y={n.y + 50} textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.7)">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}