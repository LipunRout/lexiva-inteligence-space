'use client';

import React, { useId, useState } from 'react';
import Link from 'next/link';

type BlobKind = 'lobes' | 'offset' | 'cross';
type FaceKind = 'sparkle' | 'chevrons' | 'frown' | 'round';

const CARDS: {
  title: string;
  line: string;
  colors: [string, string, string];
  shape: BlobKind;
  face: FaceKind;
}[] = [
  { title: 'Explore', line: 'Open-ended thinking', colors: ['#FF8DB4', '#FF2E7E', '#D6104F'], shape: 'lobes', face: 'sparkle' },
  { title: 'Compare', line: 'Side-by-side answers', colors: ['#FFA8FF', '#F25CF0', '#C21FD0'], shape: 'offset', face: 'chevrons' },
  { title: 'Draft', line: 'First versions, faster', colors: ['#5BE0AE', '#1FA67A', '#0E7355'], shape: 'lobes', face: 'frown' },
  { title: 'Review', line: 'A second opinion', colors: ['#B4FFAE', '#5BE86B', '#2DB846'], shape: 'lobes', face: 'round' },
  { title: 'Summarize', line: 'Long text, short answer', colors: ['#7ACFFF', '#2F7BFF', '#1D4FD8'], shape: 'cross', face: 'sparkle' },
  { title: 'Plan', line: 'From idea to next steps', colors: ['#CDAEFF', '#8A5CF5', '#5B30C9'], shape: 'offset', face: 'round' },
];

const CSS = `
@keyframes pp-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes pp-float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
.pp-track { animation: pp-scroll 45s linear infinite; }
.pp-viewport:hover .pp-track,
.pp-viewport:focus-within .pp-track,
.pp-paused .pp-track { animation-play-state: paused; }
.pp-blob { animation: pp-float 5s ease-in-out infinite; filter: drop-shadow(0 14px 14px rgba(0,0,0,.55)); }
.pp-card:nth-child(2n) .pp-blob { animation-delay: -1.5s; }
.pp-card:nth-child(3n) .pp-blob { animation-delay: -3s; }
.pp-card:hover .pp-blob { animation-duration: 2.4s; }
@media (prefers-reduced-motion: reduce) {
  .pp-track, .pp-blob { animation: none; }
  .pp-viewport { overflow-x: auto; }
}
`;

export function Perspectives() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="relative border-t border-white/[0.08] bg-[#030303] py-20 sm:py-24">
      <style>{CSS}</style>

      <div className="mx-auto max-w-[1200px] px-4">
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
          Perspectives
        </p>
        <h2 className="max-w-[760px] text-[40px] font-medium leading-[1.02] tracking-[-0.055em] text-white sm:text-[60px]">
          Many ways to <span className="hero-gradient">think it through</span>
        </h2>
        <p className="mt-5 max-w-[640px] text-[17px] leading-[1.6] text-white/60">
          Different tasks call for different approaches. These are the conversation styles Lexiva is
          being designed around.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/chat"
            className="inline-flex h-[52px] items-center rounded-full border border-white/[0.2] bg-white/[0.04] px-7 text-[15px] font-semibold text-white transition hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
          >
            Open chat preview
          </Link>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? 'Play scrolling cards' : 'Pause scrolling cards'}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.04] text-white transition hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
          >
            {paused ? (
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M6 4l10 6-10 6z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <rect x="5" y="4" width="3.5" height="12" rx="1" />
                <rect x="11.5" y="4" width="3.5" height="12" rx="1" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Auto-scrolling strip */}
      <div
        role="group"
        aria-label="Conversation styles"
        className={`pp-viewport mt-10 overflow-hidden pb-4 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] ${
          paused ? 'pp-paused' : ''
        }`}
      >
        <div className="pp-track flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-5 pr-5">
              {CARDS.map((c) => (
                <li
                  key={c.title}
                  className="pp-card group w-[280px] shrink-0 rounded-[24px] border border-white/[0.1] bg-white/[0.03] p-7 transition duration-200 hover:border-indigo-300/30 hover:bg-white/[0.06] sm:w-[320px]"
                >
                  <div className="flex items-start justify-between">
                    <Blob colors={c.colors} shape={c.shape} face={c.face} />
                    <span className="rounded-full border border-white/[0.12] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
                      Planned
                    </span>
                  </div>
                  <h3 className="mt-14 text-[26px] font-medium tracking-[-0.04em] text-white">{c.title}</h3>
                  <p className="mt-2 text-[17px] text-white/55">{c.line}</p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Glossy blob icons (original SVG, no assets) ---------- */

function Blob({
  colors,
  shape,
  face,
}: {
  colors: [string, string, string];
  shape: BlobKind;
  face: FaceKind;
}) {
  const id = 'b' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const dark = '#1a1a1f';
  const center = shape === 'offset' ? { x: 34, y: 30 } : { x: 48, y: 46 };

  return (
    <svg viewBox="0 0 96 96" className="pp-blob h-[84px] w-[84px]" aria-hidden="true">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="14" y1="8" x2="82" y2="90">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="0.5" stopColor={colors[1]} />
          <stop offset="1" stopColor={colors[2]} />
        </linearGradient>
      </defs>

      <g fill={`url(#${id})`}>
        {shape === 'lobes' && (
          <>
            <rect x="8" y="20" width="32" height="58" rx="16" />
            <rect x="32" y="10" width="32" height="76" rx="16" />
            <rect x="56" y="20" width="32" height="58" rx="16" />
          </>
        )}
        {shape === 'offset' && (
          <>
            <rect x="8" y="10" width="54" height="48" rx="18" />
            <rect x="34" y="36" width="54" height="50" rx="18" />
          </>
        )}
        {shape === 'cross' && (
          <g transform="rotate(45 48 48)">
            <rect x="6" y="33" width="84" height="30" rx="15" />
            <rect x="33" y="6" width="30" height="84" rx="15" />
          </g>
        )}
      </g>

      <ellipse cx="28" cy="22" rx="13" ry="6" fill="#fff" opacity="0.38" transform="rotate(-28 28 22)" />
      <ellipse cx="70" cy="80" rx="12" ry="4" fill="#000" opacity="0.14" />

      <g transform={`translate(${center.x} ${center.y})`} fill={dark} stroke="none">
        {face === 'sparkle' &&
          [-11, 11].map((x) => (
            <path
              key={x}
              transform={`translate(${x} 0)`}
              d="M0 -6.5 L1.7 -1.7 L6.5 0 L1.7 1.7 L0 6.5 L-1.7 1.7 L-6.5 0 L-1.7 -1.7Z"
            />
          ))}
        {face === 'chevrons' && (
          <g fill="none" stroke={dark} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-15 -5 L-8 0 L-15 5" />
            <path d="M15 -5 L8 0 L15 5" />
          </g>
        )}
        {face === 'frown' && (
          <g fill="none" stroke={dark} strokeWidth="4" strokeLinecap="round">
            <path d="M-16 -4 Q-9 -3 -6 4" />
            <path d="M16 -4 Q9 -3 6 4" />
          </g>
        )}
        {face === 'round' &&
          [-9, 9].map((x) => (
            <g key={x}>
              <circle cx={x} cy="0" r="5" />
              <circle cx={x + 1.6} cy="-1.6" r="1.6" fill="#fff" />
            </g>
          ))}
      </g>
    </svg>
  );
}