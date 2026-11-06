import React from 'react';
import Link from 'next/link';

const ROWS = [
  { title: 'Try the chat preview', sub: 'See the conversation space (local only)', href: '/chat' },
  { title: 'Check model setup', sub: 'How providers will be connected securely', href: '/models' },
  { title: 'See how comparison will work', sub: 'The compare layout, currently disabled', href: '/compare' },
];

export function GetStarted() {
  return (
    <section className="bg-[#030303] px-4 py-20 sm:py-24">
      <div className="mx-auto grid max-w-[1200px] gap-10 rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-indigo-500/[0.08] via-white/[0.02] to-rose-500/[0.06] p-6 sm:p-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-[40px] font-medium leading-[1.02] tracking-[-0.055em] text-white sm:text-[60px]">
            Get started <span className="hero-gradient">easily</span>
          </h2>
          <p className="mt-6 max-w-[480px] text-[18px] leading-[1.6] text-white/60">
            Tour the prototype, check how models will connect, or see how side-by-side comparison is
            planned.
          </p>
        </div>

        <ul className="space-y-4">
          {ROWS.map((r) => (
            <li key={r.title}>
              <Link
                href={r.href}
                className="group flex items-center justify-between gap-4 rounded-[18px] border border-white/[0.1] bg-white/[0.04] px-6 py-6 transition hover:border-indigo-300/30 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
              >
                <span>
                  <span className="block text-[24px] font-medium tracking-[-0.035em] text-white">
                    {r.title}
                  </span>
                  <span className="mt-1 block text-[16px] text-white/55">{r.sub}</span>
                </span>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#0E0D14] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
                  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
                    <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}