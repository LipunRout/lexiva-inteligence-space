'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const HEADLINE = ['Make', 'more', 'of', 'every', 'conversation.'];

const STEPS = [
  {
    number: '01',
    title: 'Choose a perspective',
    description: 'Bring supported AI models into one focused conversation space.',
    tone: 'from-indigo-400/20 to-violet-500/0',
    chip: 'bg-indigo-400/15 text-indigo-200 ring-indigo-300/25',
  },
  {
    number: '02',
    title: 'Compare responses',
    description: 'See which model answered and understand different responses at a glance.',
    tone: 'from-rose-400/20 to-pink-500/0',
    chip: 'bg-rose-400/15 text-rose-200 ring-rose-300/25',
  },
  {
    number: '03',
    title: 'Keep your context',
    description: 'Return to conversations and continue exploring from where you left off.',
    tone: 'from-emerald-400/20 to-teal-500/0',
    chip: 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/25',
  },
];

export function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // Intro sequence (timed, so it plays even though everything is already in view)
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        });
        tl.from('.ab-pill', { opacity: 0, y: 16, duration: 0.6 })
          .from('.ab-word', { opacity: 0, y: 28, duration: 0.7, stagger: 0.09 }, '-=0.3')
          .from('.ab-sub', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
          .from('.ab-card', { opacity: 0, y: 40, duration: 0.8, stagger: 0.12 }, '-=0.4');

        // Orb parallax
        gsap.to('.ab-orb-a', {
          yPercent: -35,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.to('.ab-orb-b', {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });

        // Visual 01: chips highlight in turn
        const chips = gsap.utils.toArray<HTMLElement>('.ab-chip');
        const tl1 = gsap.timeline({
          repeat: -1,
          scrollTrigger: { trigger: '.ab-v1', start: 'top 95%', toggleActions: 'play pause resume pause' },
        });
        chips.forEach((chip) => {
          tl1
            .to(chips, { opacity: 0.35, scale: 1, duration: 0.25 }, '>')
            .to(chip, { opacity: 1, scale: 1.03, duration: 0.35, ease: 'back.out(2)' }, '<')
            .to({}, { duration: 0.9 });
        });

        // Visual 02: lines draw in
        gsap.from('.ab-line', {
          scaleX: 0,
          transformOrigin: 'left center',
          stagger: 0.1,
          duration: 0.8,
          delay: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.ab-v2', start: 'top 95%' },
        });

        // Visual 03: timeline draws
        gsap.fromTo(
          '.ab-track',
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            duration: 1.2,
            delay: 1.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.ab-v3', start: 'top 95%' },
          }
        );
        gsap.from('.ab-node', {
          scale: 0,
          opacity: 0,
          stagger: 0.25,
          duration: 0.5,
          delay: 1.3,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: '.ab-v3', start: 'top 95%' },
        });
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="about"
      ref={root}
      className="relative flex flex-col justify-center overflow-hidden border-t border-white/[0.08] bg-[#030303] px-4 py-10 lg:min-h-[calc(100svh-72px)] lg:py-6"
    >
      {/* Glow orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="ab-orb-a absolute -left-32 top-[20%] h-[380px] w-[380px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="ab-orb-b absolute -right-32 top-[45%] h-[380px] w-[380px] rounded-full bg-rose-500/15 blur-[120px]" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,#000_30%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1240px]">
        {/* Intro */}
        <div className="mx-auto max-w-[900px] text-center">
          <p className="ab-pill mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-indigo-400 to-rose-400" />
            Multiple perspectives, one place
          </p>
          <h2 className="text-[34px] font-medium leading-[1.05] tracking-[-0.055em] text-white sm:text-[48px] lg:whitespace-nowrap lg:text-[56px]">
            {HEADLINE.map((w, i) => (
              <span
                key={w}
                className={`ab-word mr-[0.22em] inline-block ${i === HEADLINE.length - 1 ? 'hero-gradient' : ''}`}
              >
                {w}
              </span>
            ))}
          </h2>
          <p className="ab-sub mx-auto mt-3 max-w-[560px] text-[16px] leading-[1.5] text-white/60">
            Explore different model perspectives without losing your context or your train of thought.
          </p>
        </div>

        {/* Cards: one row on desktop */}
        <div
          id="workflow"
          className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        >
          {STEPS.map((s, i) => (
            <article
              key={s.number}
              className={`ab-card flex h-full flex-col overflow-hidden rounded-[24px] border border-white/[0.1] bg-gradient-to-b ${s.tone} bg-[#0B0B0E] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] transition-colors duration-300 hover:border-white/[0.22] motion-reduce:transition-none`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-[12px] font-semibold ring-1 ${s.chip}`}
                >
                  {s.number}
                </span>
                <h3 className="text-[22px] font-semibold leading-[1.1] tracking-[-0.04em] text-white sm:text-[24px]">
                  {s.title}
                </h3>
              </div>
              <p className="mt-3 text-[14.5px] leading-[1.5] text-white/60">{s.description}</p>

              <div
                aria-hidden="true"
                className="mt-4 h-[150px] rounded-[16px] border border-white/[0.08] bg-black/40 p-4"
              >
                {i === 0 && <VisualChoose />}
                {i === 1 && <VisualCompare />}
                {i === 2 && <VisualContext />}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Card visuals (decorative, no fake responses) ---- */

function VisualChoose() {
  const items = [
    { t: 'Model A', c: 'bg-indigo-400/20 text-indigo-100 ring-indigo-300/40' },
    { t: 'Model B', c: 'bg-violet-400/20 text-violet-100 ring-violet-300/40' },
    { t: 'Model C', c: 'bg-rose-400/20 text-rose-100 ring-rose-300/40' },
  ];
  return (
    <div className="ab-v1 flex h-full flex-col justify-between gap-1.5">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Select a model</p>
      {items.map((it) => (
        <div
          key={it.t}
          className={`ab-chip flex items-center justify-between rounded-lg px-3 py-1.5 text-[13px] font-medium ring-1 ${it.c}`}
        >
          {it.t}
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        </div>
      ))}
    </div>
  );
}

function VisualCompare() {
  const col = (label: string, color: string, widths: string[]) => (
    <div className="min-w-0 flex-1 space-y-2.5">
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${color}`}>
        {label}
      </span>
      {widths.map((w, i) => (
        <div key={i} className="h-2 rounded-full bg-white/[0.08]">
          <div className={`ab-line h-full rounded-full ${color.split(' ')[0]}`} style={{ width: w }} />
        </div>
      ))}
    </div>
  );
  return (
    <div className="ab-v2 flex h-full items-center gap-4">
      {col('Model A', 'bg-indigo-400/60 text-white', ['90%', '65%', '78%', '40%'])}
      <div className="h-20 w-px shrink-0 bg-white/[0.12]" />
      {col('Model B', 'bg-rose-400/60 text-white', ['70%', '88%', '52%', '66%'])}
    </div>
  );
}

function VisualContext() {
  const rows = ['Earlier conversation', 'Follow-up', 'Continue here'];
  return (
    <div className="ab-v3 relative flex h-full flex-col justify-between pl-8">
      <div className="absolute bottom-3 left-[13px] top-3 w-px bg-white/[0.08]" />
      <div className="ab-track absolute bottom-3 left-[13px] top-3 w-px bg-gradient-to-b from-emerald-300 to-indigo-300" />
      {rows.map((r) => (
        <div key={r} className="relative flex items-center gap-3">
          <span className="ab-node absolute -left-8 flex h-[27px] w-[27px] items-center justify-center rounded-full border border-emerald-300/50 bg-[#0B0B0E]">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
          </span>
          <span className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-[13px] text-white/75">{r}</span>
        </div>
      ))}
    </div>
  );
}