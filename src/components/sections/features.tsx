'use client';

import React from 'react';
import { useStaggerChildren } from '@/lib/animations';

const features = [
  {
    title: 'Task tracking',
    description: 'Keep every task in one place with clear ownership and due dates.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    title: 'Project timelines',
    description: 'Visualize work across timelines so nothing slips through the cracks.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7h16M4 12h10M4 17h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="18" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Team collaboration',
    description: 'Comment, assign, and update in real time with your whole team.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2 1-4.2A7.5 7.5 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 11.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Custom fields',
    description: 'Tailor your project with fields that match your workflow exactly.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="9" cy="7" r="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="15" cy="17" r="2.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

const tones = [
  'bg-indigo-400/15 text-indigo-200 ring-1 ring-indigo-300/20',
  'bg-rose-400/15 text-rose-200 ring-1 ring-rose-300/20',
  'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/20',
  'bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/20',
];

export function Features() {
  const { container } = useStaggerChildren(0.2);

  return (
    <section
      id="features"
      className="relative border-t border-white/[0.08] bg-[#030303] px-4 py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05]"
      />
      <div className="relative mx-auto max-w-[1200px]">
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
            Thoughtful by design
          </p>
          <h2 className="mb-4 text-[36px] font-medium leading-[1.05] tracking-[-0.05em] text-white sm:text-[48px] lg:text-[60px]">
            Everything <span className="hero-gradient">teams need</span>
          </h2>
          <p className="text-[17px] leading-[1.6] text-white/60">
            Powerful features wrapped in a calm, neutral interface that helps you
            focus on the work that matters.
          </p>
        </div>

        <div
          ref={container}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {features.map((feature, i) => (
            <div key={feature.title} data-stagger-item className="h-full">
              <article className="group h-full rounded-[22px] border border-white/[0.1] bg-white/[0.03] p-6 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-indigo-300/30 hover:bg-white/[0.06] hover:shadow-[0_16px_40px_-12px_rgba(129,140,248,0.3)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7">
                <div
                  className={`mb-7 flex h-12 w-12 items-center justify-center rounded-[14px] [&_svg]:h-5 [&_svg]:w-5 ${tones[i % tones.length]}`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-[20px] font-semibold tracking-[-0.03em] text-white">
                  {feature.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-white/60">
                  {feature.description}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}