'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

const AUTO_MS = 6000;

const CSS = `
@keyframes pv-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes pv-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
.pv-track-l { animation: pv-left 40s linear infinite; }
.pv-track-r { animation: pv-right 46s linear infinite; }
.pv-viewport:hover .pv-track-l, .pv-viewport:hover .pv-track-r { animation-play-state: paused; }

/* Graph: one 6s cycle, Prompt to Models to Compare, looping */
.ig-seg { stroke-dasharray: 1 1; stroke-dashoffset: 1; opacity: 0; animation-duration: 6s; animation-iteration-count: infinite; animation-timing-function: linear; }
.ig-s1 { animation-name: ig-s1; }
.ig-s2 { animation-name: ig-s2; }
@keyframes ig-s1 {
  0%   { stroke-dashoffset: 1; opacity: 1; }
  4%   { stroke-dashoffset: 1; opacity: 1; }
  30%  { stroke-dashoffset: 0; opacity: 1; }
  88%  { stroke-dashoffset: 0; opacity: 1; }
  96%  { stroke-dashoffset: 0; opacity: 0; }
  100% { stroke-dashoffset: 1; opacity: 0; }
}
@keyframes ig-s2 {
  0%   { stroke-dashoffset: 1; opacity: 1; }
  32%  { stroke-dashoffset: 1; opacity: 1; }
  58%  { stroke-dashoffset: 0; opacity: 1; }
  88%  { stroke-dashoffset: 0; opacity: 1; }
  96%  { stroke-dashoffset: 0; opacity: 0; }
  100% { stroke-dashoffset: 1; opacity: 0; }
}
.ig-lit { opacity: 0; transform-box: fill-box; transform-origin: center; animation-duration: 6s; animation-iteration-count: infinite; animation-timing-function: ease-out; }
.ig-l0 { animation-name: ig-l0; }
.ig-l1 { animation-name: ig-l1; }
.ig-l2 { animation-name: ig-l2; }
@keyframes ig-l0 {
  0%   { opacity: 0; transform: scale(1); }
  4%   { opacity: .9; transform: scale(1); }
  22%  { opacity: 0; transform: scale(1.9); }
  100% { opacity: 0; transform: scale(1.9); }
}
@keyframes ig-l1 {
  0%, 26% { opacity: 0; transform: scale(1); }
  30%     { opacity: .9; transform: scale(1); }
  50%     { opacity: 0; transform: scale(1.9); }
  100%    { opacity: 0; transform: scale(1.9); }
}
@keyframes ig-l2 {
  0%, 56% { opacity: 0; transform: scale(1); }
  60%     { opacity: .9; transform: scale(1); }
  80%     { opacity: 0; transform: scale(1.9); }
  100%    { opacity: 0; transform: scale(1.9); }
}

@keyframes ig-bar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.ig-bar { transform-origin: left; animation: ig-bar ${AUTO_MS}ms linear forwards; }

@media (prefers-reduced-motion: reduce) {
  .pv-track-l, .pv-track-r, .ig-bar, .ig-lit { animation: none; }
  .ig-seg { animation: none; stroke-dashoffset: 0; opacity: 1; }
  .ig-bar { transform: scaleX(1); }
}
`;

function MarqueeRow({ items, direction }: { items: { name: string; dot: string }[]; direction: 'l' | 'r' }) {
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
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(0);
  const [auto, setAuto] = useState(true);

  const autoOn = auto && !reduce;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.from('.ig-word', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.ig-head', start: 'top 85%' },
        });
        gsap.from('.ig-panel', {
          opacity: 0,
          y: 50,
          scale: 0.97,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.ig-panel', start: 'top 90%' },
        });
        gsap.from('.ig-acc', {
          opacity: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.ig-accwrap', start: 'top 90%' },
        });
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  const HEAD = ['AI', 'that', 'works', 'the', 'way', 'your', 'conversation', 'works'];

  return (
    <section ref={root} className="relative w-full overflow-hidden bg-[#030303]">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Running provider strip */}
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

      {/* Main block */}
      <div className="relative overflow-hidden px-4 py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 h-[320px] w-[min(720px,100%)] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[100px]"
        />

        <div className="relative mx-auto w-full max-w-[1200px]">
          <h2 className="ig-head max-w-[820px] text-[32px] font-medium leading-[1.05] tracking-[-0.055em] text-white sm:text-[56px] lg:text-[72px]">
            {HEAD.map((w, i) => (
              <span key={i} className={`ig-word mr-[0.2em] inline-block ${w === 'conversation' ? 'hero-gradient' : ''}`}>
                {w}
              </span>
            ))}
          </h2>

          <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* Graph panel */}
            <div className="ig-panel relative min-w-0 overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#070709] p-4 shadow-[0_30px_80px_-30px_rgba(129,140,248,0.4)] sm:rounded-[28px] sm:p-6">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-60 [background-size:22px_22px] [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_85%)]"
              />
              <span className="relative z-10 inline-flex rounded-full border border-white/[0.12] bg-white/[0.05] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-white/60">
                Concept preview
              </span>
              <div className="relative z-10 mx-auto mt-2 max-w-[420px] sm:hidden">
                <Graph vertical />
              </div>
              <div className="relative z-10 hidden sm:block">
                <Graph />
              </div>
            </div>

            {/* Accordion */}
            <div className="ig-accwrap min-w-0 self-center border-t border-white/[0.12]">
              {ITEMS.map((item, i) => {
                const active = open === i;
                return (
                  <div key={item.title} className="ig-acc relative border-b border-white/[0.12]">
                    <button
                      type="button"
                      aria-expanded={active}
                      onClick={() => {
                        setAuto(false);
                        setOpen(active ? -1 : i);
                      }}
                      className="flex min-h-[64px] w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300 sm:py-6"
                    >
                      <span className="text-[19px] font-medium tracking-[-0.03em] text-white sm:text-[22px]">
                        {item.title}
                      </span>
                      <span
                        className={clsx(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.05] text-white transition-transform duration-300 motion-reduce:transition-none',
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
                          <p className="pb-6 text-[16px] leading-[1.6] text-white/60 sm:text-[17px]">{item.body}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {active && autoOn && (
                      <span
                        key={'bar' + i}
                        aria-hidden="true"
                        onAnimationEnd={() => setOpen((o) => (o + 1) % ITEMS.length)}
                        className="ig-bar absolute bottom-[-1px] left-0 h-[2px] w-full bg-gradient-to-r from-indigo-300 to-rose-300"
                      />
                    )}
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

/* Graph: Prompt to Models to Compare, looping */

type N = { x: number; y: number; label: string; c: string; dy: number; stage: 0 | 1 | 2 };

function Graph({ vertical = false }: { vertical?: boolean }) {
  const nodes: N[] = vertical
    ? [
        { x: 170, y: 60, label: 'Prompt', c: '#A5B4FC', dy: -40, stage: 0 },
        { x: 60, y: 240, label: 'Model A', c: '#D8B4FE', dy: 50, stage: 1 },
        { x: 170, y: 240, label: 'Model B', c: '#FDA4AF', dy: 50, stage: 1 },
        { x: 280, y: 240, label: 'Model C', c: '#FCD34D', dy: 50, stage: 1 },
        { x: 170, y: 430, label: 'Compare', c: '#67E8F9', dy: 50, stage: 2 },
      ]
    : [
        { x: 90, y: 200, label: 'Prompt', c: '#A5B4FC', dy: 50, stage: 0 },
        { x: 310, y: 80, label: 'Model A', c: '#D8B4FE', dy: 50, stage: 1 },
        { x: 310, y: 200, label: 'Model B', c: '#FDA4AF', dy: 50, stage: 1 },
        { x: 310, y: 320, label: 'Model C', c: '#FCD34D', dy: 50, stage: 1 },
        { x: 530, y: 200, label: 'Compare', c: '#67E8F9', dy: 50, stage: 2 },
      ];

  const lines = vertical
    ? [
        'M170 60 C170 150 60 150 60 240',
        'M170 60 L170 240',
        'M170 60 C170 150 280 150 280 240',
        'M60 240 C60 340 170 340 170 430',
        'M170 240 L170 430',
        'M280 240 C280 340 170 340 170 430',
      ]
    : [
        'M90 200 C190 200 210 80 310 80',
        'M90 200 L310 200',
        'M90 200 C190 200 210 320 310 320',
        'M310 80 C410 80 430 200 530 200',
        'M310 200 L530 200',
        'M310 320 C410 320 430 200 530 200',
      ];

  const colors = ['#D8B4FE', '#FDA4AF', '#FCD34D', '#D8B4FE', '#FDA4AF', '#FCD34D'];

  return (
    <svg
      viewBox={vertical ? '0 0 340 500' : '0 0 620 400'}
      className="h-auto w-full"
      role="img"
      aria-label="Concept diagram: one prompt sent to several models and compared"
    >
      <g fill="none" strokeWidth="1.6">
        {lines.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="rgba(165,180,252,0.18)" />
            <path
              d={d}
              pathLength={1}
              stroke={colors[i]}
              className={`ig-seg ${i < 3 ? 'ig-s1' : 'ig-s2'}`}
            />
          </g>
        ))}
      </g>
      {nodes.map((n) => (
        <g key={n.label}>
          <circle
            cx={n.x}
            cy={n.y}
            r="26"
            fill={n.c}
            fillOpacity="0.18"
            stroke={n.c}
            strokeWidth="1.2"
            className={`ig-lit ig-l${n.stage}`}
          />
          <circle cx={n.x} cy={n.y} r="26" fill="#0B0B10" stroke={n.c} strokeWidth="1.5" />
          <circle cx={n.x} cy={n.y} r="7" fill={n.c} />
          <text
            x={n.x}
            y={n.y + n.dy}
            textAnchor="middle"
            fontSize={vertical ? 15 : 13}
            fill="rgba(255,255,255,0.75)"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}