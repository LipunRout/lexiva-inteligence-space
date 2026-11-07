// 'use client';

// import React, { useId, useState } from 'react';
// import Link from 'next/link';

// type BlobKind = 'lobes' | 'offset' | 'cross';
// type FaceKind = 'sparkle' | 'chevrons' | 'frown' | 'round';

// const CARDS: {
//   title: string;
//   line: string;
//   colors: [string, string, string];
//   shape: BlobKind;
//   face: FaceKind;
// }[] = [
//   { title: 'Explore', line: 'Open-ended thinking', colors: ['#FF8DB4', '#FF2E7E', '#D6104F'], shape: 'lobes', face: 'sparkle' },
//   { title: 'Compare', line: 'Side-by-side answers', colors: ['#FFA8FF', '#F25CF0', '#C21FD0'], shape: 'offset', face: 'chevrons' },
//   { title: 'Draft', line: 'First versions, faster', colors: ['#5BE0AE', '#1FA67A', '#0E7355'], shape: 'lobes', face: 'frown' },
//   { title: 'Review', line: 'A second opinion', colors: ['#B4FFAE', '#5BE86B', '#2DB846'], shape: 'lobes', face: 'round' },
//   { title: 'Summarize', line: 'Long text, short answer', colors: ['#7ACFFF', '#2F7BFF', '#1D4FD8'], shape: 'cross', face: 'sparkle' },
//   { title: 'Plan', line: 'From idea to next steps', colors: ['#CDAEFF', '#8A5CF5', '#5B30C9'], shape: 'offset', face: 'round' },
// ];

// const CSS = `
// @keyframes pp-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
// @keyframes pp-float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(2deg); } }
// .pp-track { animation: pp-scroll 45s linear infinite; }
// .pp-viewport:hover .pp-track,
// .pp-viewport:focus-within .pp-track,
// .pp-paused .pp-track { animation-play-state: paused; }
// .pp-blob { animation: pp-float 5s ease-in-out infinite; filter: drop-shadow(0 14px 14px rgba(0,0,0,.55)); }
// .pp-card:nth-child(2n) .pp-blob { animation-delay: -1.5s; }
// .pp-card:nth-child(3n) .pp-blob { animation-delay: -3s; }
// .pp-card:hover .pp-blob { animation-duration: 2.4s; }
// @media (prefers-reduced-motion: reduce) {
//   .pp-track, .pp-blob { animation: none; }
//   .pp-viewport { overflow-x: auto; }
// }
// `;

// export function Perspectives() {
//   const [paused, setPaused] = useState(false);

//   return (
//     <section className="relative w-full overflow-hidden border-t border-white/[0.08] bg-[#030303] py-16 sm:py-24">
//       <style dangerouslySetInnerHTML={{ __html: CSS }} />

//       <div className="mx-auto max-w-[1200px] px-4">
//         <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
//           Perspectives
//         </p>
//         <h2 className="max-w-[760px] text-[34px] font-medium leading-[1.05] tracking-[-0.055em] text-white sm:text-[60px] sm:leading-[1.02]">
//           Many ways to <span className="hero-gradient">think it through</span>
//         </h2>
//         <p className="mt-5 max-w-[640px] text-[16px] leading-[1.6] text-white/60 sm:text-[17px]">
//           Different tasks call for different approaches. These are the conversation styles Lexiva is
//           being designed around.
//         </p>

//         <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
//           <Link
//             href="/chat"
//             className="inline-flex h-[52px] items-center rounded-full border border-white/[0.2] bg-white/[0.04] px-7 text-[15px] font-semibold text-white transition hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
//           >
//             Open chat preview
//           </Link>
//           <button
//             type="button"
//             onClick={() => setPaused((p) => !p)}
//             aria-pressed={paused}
//             aria-label={paused ? 'Play scrolling cards' : 'Pause scrolling cards'}
//             className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.15] bg-white/[0.04] text-white transition hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
//           >
//             {paused ? (
//               <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
//                 <path d="M6 4l10 6-10 6z" />
//               </svg>
//             ) : (
//               <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
//                 <rect x="5" y="4" width="3.5" height="12" rx="1" />
//                 <rect x="11.5" y="4" width="3.5" height="12" rx="1" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Auto-scrolling strip */}
//       <div
//         role="group"
//         aria-label="Conversation styles"
//         className={`pp-viewport mt-10 w-full overflow-hidden pb-4 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] ${
//           paused ? 'pp-paused' : ''
//         }`}
//       >
//         <div className="pp-track flex w-max">
//           {[0, 1].map((copy) => (
//             <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-5 pr-5">
//               {CARDS.map((c) => (
//                 <li
//                   key={c.title}
//                   className="pp-card group w-[260px] shrink-0 rounded-[24px] border border-white/[0.1] bg-white/[0.03] p-6 transition duration-200 hover:border-indigo-300/30 hover:bg-white/[0.06] sm:w-[320px] sm:p-7"
//                 >
//                   <div className="flex items-start justify-between">
//                     <Blob colors={c.colors} shape={c.shape} face={c.face} />
//                     <span className="rounded-full border border-white/[0.12] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
//                       Planned
//                     </span>
//                   </div>
//                   <h3 className="mt-12 text-[24px] font-medium tracking-[-0.04em] text-white sm:mt-14 sm:text-[26px]">{c.title}</h3>
//                   <p className="mt-2 text-[16px] text-white/55 sm:text-[17px]">{c.line}</p>
//                 </li>
//               ))}
//             </ul>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* Glossy blob icons (original SVG, no assets) */

// function Blob({
//   colors,
//   shape,
//   face,
// }: {
//   colors: [string, string, string];
//   shape: BlobKind;
//   face: FaceKind;
// }) {
//   const id = 'b' + useId().replace(/[^a-zA-Z0-9]/g, '');
//   const dark = '#1a1a1f';
//   const center = shape === 'offset' ? { x: 34, y: 30 } : { x: 48, y: 46 };

//   return (
//     <svg viewBox="0 0 96 96" className="pp-blob h-[84px] w-[84px]" aria-hidden="true">
//       <defs>
//         <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="14" y1="8" x2="82" y2="90">
//           <stop offset="0" stopColor={colors[0]} />
//           <stop offset="0.5" stopColor={colors[1]} />
//           <stop offset="1" stopColor={colors[2]} />
//         </linearGradient>
//       </defs>

//       <g fill={`url(#${id})`}>
//         {shape === 'lobes' && (
//           <>
//             <rect x="8" y="20" width="32" height="58" rx="16" />
//             <rect x="32" y="10" width="32" height="76" rx="16" />
//             <rect x="56" y="20" width="32" height="58" rx="16" />
//           </>
//         )}
//         {shape === 'offset' && (
//           <>
//             <rect x="8" y="10" width="54" height="48" rx="18" />
//             <rect x="34" y="36" width="54" height="50" rx="18" />
//           </>
//         )}
//         {shape === 'cross' && (
//           <g transform="rotate(45 48 48)">
//             <rect x="6" y="33" width="84" height="30" rx="15" />
//             <rect x="33" y="6" width="30" height="84" rx="15" />
//           </g>
//         )}
//       </g>

//       <ellipse cx="28" cy="22" rx="13" ry="6" fill="#fff" opacity="0.38" transform="rotate(-28 28 22)" />
//       <ellipse cx="70" cy="80" rx="12" ry="4" fill="#000" opacity="0.14" />

//       <g transform={`translate(${center.x} ${center.y})`} fill={dark} stroke="none">
//         {face === 'sparkle' &&
//           [-11, 11].map((x) => (
//             <path
//               key={x}
//               transform={`translate(${x} 0)`}
//               d="M0 -6.5 L1.7 -1.7 L6.5 0 L1.7 1.7 L0 6.5 L-1.7 1.7 L-6.5 0 L-1.7 -1.7Z"
//             />
//           ))}
//         {face === 'chevrons' && (
//           <g fill="none" stroke={dark} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M-15 -5 L-8 0 L-15 5" />
//             <path d="M15 -5 L8 0 L15 5" />
//           </g>
//         )}
//         {face === 'frown' && (
//           <g fill="none" stroke={dark} strokeWidth="4" strokeLinecap="round">
//             <path d="M-16 -4 Q-9 -3 -6 4" />
//             <path d="M16 -4 Q9 -3 6 4" />
//           </g>
//         )}
//         {face === 'round' &&
//           [-9, 9].map((x) => (
//             <g key={x}>
//               <circle cx={x} cy="0" r="5" />
//               <circle cx={x + 1.6} cy="-1.6" r="1.6" fill="#fff" />
//             </g>
//           ))}
//       </g>
//     </svg>
//   );
// }

'use client';

import React, { useId, useState } from 'react';
import Link from 'next/link';

type BlobKind = 'lobes' | 'offset' | 'cross';
type FaceKind = 'sparkle' | 'chevrons' | 'frown' | 'round';

const CARDS: {
  title: string;
  line: string;
  tint: string;
  shape: BlobKind;
  face: FaceKind;
}[] = [
  { title: 'Explore', line: 'Open-ended thinking', tint: '#ff5c7a', shape: 'lobes', face: 'sparkle' },
  { title: 'Compare', line: 'Side-by-side answers', tint: '#d8b4fe', shape: 'offset', face: 'chevrons' },
  { title: 'Draft', line: 'First versions, faster', tint: '#5be0ae', shape: 'lobes', face: 'frown' },
  { title: 'Review', line: 'A second opinion', tint: '#ffd23f', shape: 'lobes', face: 'round' },
  { title: 'Summarize', line: 'Long text, short answer', tint: '#8fdcff', shape: 'cross', face: 'sparkle' },
  { title: 'Plan', line: 'From idea to next steps', tint: '#a5b4fc', shape: 'offset', face: 'round' },
];

const CSS = `
.pp{--ink:#f4f1ea;--bg:#0B0B0E;--accent:#a5b4fc;background-color:#0A0A0C;background-image:repeating-linear-gradient(135deg,rgba(244,241,234,.05) 0 1px,transparent 1px 10px)}
@keyframes pp-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pp-bob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-5px) rotate(2deg)}}
@keyframes pp-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
.pp-track{animation:pp-scroll 45s linear infinite}
.pp-viewport:hover .pp-track,.pp-viewport:focus-within .pp-track,.pp-paused .pp-track{animation-play-state:paused}
.pp-tick{width:9px;height:9px;border:2px solid var(--accent);border-radius:99px;transform:rotate(-8deg)}
.pp-scribble{position:absolute;left:0;right:0;bottom:-8px;width:100%;height:9px;overflow:visible}
.pp-scribble path{fill:none;stroke:var(--accent);stroke-width:2.4;stroke-linecap:round}
.pp-btn{display:inline-flex;align-items:center;gap:8px;height:46px;padding:0 22px;border-radius:999px;border:2px solid var(--ink);background:var(--bg);color:var(--ink);font-size:14.5px;font-weight:750;letter-spacing:-.01em;box-shadow:0 3px 0 var(--ink);transition:transform .18s cubic-bezier(.3,1.4,.5,1),box-shadow .18s cubic-bezier(.3,1.4,.5,1)}
.pp-btn:hover{transform:translateY(-2px) rotate(-1.2deg);box-shadow:0 5px 0 var(--ink)}
.pp-btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--ink);transition-duration:.06s}
.pp-btn:focus-visible,.pp-round:focus-visible{outline:2px dashed var(--ink);outline-offset:4px}
.pp-round{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:99px;border:2px solid var(--ink);background:var(--bg);color:var(--ink);box-shadow:0 3px 0 var(--accent);transition:transform .18s cubic-bezier(.3,1.4,.5,1)}
.pp-round:hover{transform:translateY(-2px) rotate(-6deg)}
.pp-card{background:var(--bg);border:2px dashed rgba(244,241,234,.3);transition:transform .22s cubic-bezier(.3,1.5,.5,1),box-shadow .22s,border-color .2s}
.pp-card:nth-child(odd){transform:rotate(-1deg)}
.pp-card:nth-child(even){transform:rotate(1deg) translateY(6px)}
.pp-card:hover{transform:rotate(0) translateY(-4px);border-style:solid;border-color:var(--ink);box-shadow:5px 5px 0 var(--accent)}
.pp-art{fill:var(--bg);stroke:var(--ink);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;overflow:visible}
.pp-char{animation:pp-bob 4.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
.pp-card:nth-child(2n) .pp-char{animation-delay:-1.5s}
.pp-card:nth-child(3n) .pp-char{animation-delay:-3s}
.pp-card:hover .pp-char{animation-duration:1.6s}
.pp-face{fill:var(--ink);stroke:none}
.pp-face .n{fill:none;stroke:var(--ink)}
.pp-eyes{transform-box:fill-box;transform-origin:50% 50%;animation:pp-blink 5s infinite}
.pp-tag{border:1.5px dashed rgba(244,241,234,.45);border-radius:99px;padding:3px 10px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(244,241,234,.6)}
@media (prefers-reduced-motion:reduce){
.pp-track,.pp-char,.pp-eyes{animation:none}
.pp-viewport{overflow-x:auto}
.pp-card,.pp-btn,.pp-round{transition:none}
}
`;

export function Perspectives() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="pp relative w-full overflow-hidden border-t-2 border-dashed border-[#f4f1ea]/25 py-16 text-[#f4f1ea] sm:py-24">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="mx-auto max-w-[1200px] px-4">
        <p className="mb-4 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#a5b4fc]">
          <span className="pp-tick" aria-hidden="true" />
          Perspectives
        </p>
        <h2 className="max-w-[760px] text-[34px] font-semibold leading-[1.05] tracking-[-0.05em] sm:text-[60px] sm:leading-[1.02]">
          Many ways to{' '}
          <span className="hero-gradient relative inline-block">
            think it through
            <svg className="pp-scribble" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 6 C25 1 40 9 65 5 S110 1 135 5 S180 9 198 4" />
            </svg>
          </span>
        </h2>
        <p className="mt-6 max-w-[640px] text-[16px] leading-[1.6] text-[#f4f1ea]/65 sm:text-[17px]">
          Different tasks call for different approaches. These are the conversation styles Lexiva is
          being designed around.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/chat" className="pp-btn">
            Open chat preview
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? 'Play scrolling cards' : 'Pause scrolling cards'}
            className="pp-round"
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
        className={`pp-viewport mt-12 w-full overflow-hidden pb-6 pt-2 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] ${
          paused ? 'pp-paused' : ''
        }`}
      >
        <div className="pp-track flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-6 pr-6">
              {CARDS.map((c) => (
                <li
                  key={c.title}
                  className="pp-card w-[260px] shrink-0 rounded-[20px] p-6 sm:w-[320px] sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <Character tint={c.tint} shape={c.shape} face={c.face} />
                    <span className="pp-tag">Planned</span>
                  </div>
                  <h3 className="mt-12 text-[24px] font-semibold tracking-[-0.04em] sm:mt-14 sm:text-[26px]">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-[16px] text-[#f4f1ea]/60 sm:text-[17px]">{c.line}</p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Hand-drawn line characters (original SVG, same family as the footer crew) */

function Character({ tint, shape, face }: { tint: string; shape: BlobKind; face: FaceKind }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const hatch = `url(#${uid}h)`;
  const clip = `url(#${uid}c)`;
  const center = shape === 'offset' ? { x: 34, y: 32 } : { x: 48, y: 46 };

  const Body = ({ over = false }: { over?: boolean }) => (
    <>
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
      {over ? null : null}
    </>
  );

  return (
    <svg viewBox="0 0 96 96" className="pp-char h-[84px] w-[84px]" aria-hidden="true">
      <defs>
        <pattern id={`${uid}h`} width="4.6" height="4.6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <line x1="0" y1="0" x2="0" y2="4.6" stroke="#f4f1ea" strokeWidth="1.2" />
        </pattern>
        <clipPath id={`${uid}c`}>
          <rect x="58" y="0" width="40" height="96" />
        </clipPath>
      </defs>

      <ellipse cx="48" cy="90" rx="30" ry="3.5" fill="#f4f1ea" opacity="0.14" />

      <g className="pp-art">
        <Body />
      </g>
      {/* hatch shading on the right edge */}
      <g clipPath={clip} fill={hatch} stroke="none" opacity="0.7">
        <Body over />
      </g>
      {/* colour cheek */}
      <circle cx={center.x + 18} cy={center.y + 12} r="4.5" fill={tint} opacity="0.95" />

      <g className="pp-face" transform={`translate(${center.x} ${center.y})`}>
        <g className="pp-eyes">
          {face === 'sparkle' &&
            [-11, 11].map((x) => (
              <path
                key={x}
                transform={`translate(${x} 0)`}
                d="M0 -6.5 L1.7 -1.7 L6.5 0 L1.7 1.7 L0 6.5 L-1.7 1.7 L-6.5 0 L-1.7 -1.7Z"
              />
            ))}
          {face === 'chevrons' && (
            <g className="n" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path className="n" d="M-15 -5 L-8 0 L-15 5" />
              <path className="n" d="M15 -5 L8 0 L15 5" />
            </g>
          )}
          {face === 'frown' && (
            <g strokeWidth="4" strokeLinecap="round">
              <path className="n" d="M-16 -4 Q-9 -3 -6 4" />
              <path className="n" d="M16 -4 Q9 -3 6 4" />
            </g>
          )}
          {face === 'round' &&
            [-9, 9].map((x) => (
              <g key={x}>
                <circle cx={x} cy="0" r="5" />
                <circle cx={x + 1.6} cy="-1.6" r="1.6" fill="#0B0B0E" />
              </g>
            ))}
        </g>
      </g>
    </svg>
  );
}