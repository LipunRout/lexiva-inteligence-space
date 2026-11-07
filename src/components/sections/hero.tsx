// 'use client';

// import React, { FormEvent, useState } from 'react';
// import Link from 'next/link';
// import { motion, useReducedMotion } from 'framer-motion';
// import { clsx } from 'clsx';

// function ElegantShape({
//   className,
//   delay = 0,
//   width = 400,
//   height = 100,
//   rotate = 0,
//   y = 15,
//   gradient = 'from-white/[0.08]',
//   reduce = false,
// }: {
//   className?: string;
//   delay?: number;
//   width?: number;
//   height?: number;
//   rotate?: number;
//   y?: number;
//   gradient?: string;
//   reduce?: boolean;
// }) {
//   return (
//     <motion.div
//       initial={reduce ? false : { opacity: 0, y: -150, rotate: rotate - 15 }}
//       animate={{ opacity: 1, y: 0, rotate }}
//       transition={{
//         duration: 2.4,
//         delay,
//         ease: [0.23, 0.86, 0.39, 0.96],
//         opacity: { duration: 1.2 },
//       }}
//       className={clsx('absolute', className)}
//     >
//       <motion.div
//         animate={reduce ? undefined : { y: [0, y, 0] }}
//         transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
//         style={{ width, height }}
//         className="relative"
//       >
//         <div
//           className={clsx(
//             'absolute inset-0 rounded-full bg-gradient-to-r to-transparent',
//             gradient,
//             'border-2 border-white/[0.15] backdrop-blur-[2px]',
//             'shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]',
//             'after:absolute after:inset-0 after:rounded-full',
//             'after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]'
//           )}
//         />
//       </motion.div>
//     </motion.div>
//   );
// }

// export function Hero() {
//   const [email, setEmail] = useState('');
//   const [notice, setNotice] = useState<string | null>(null);
//   const reduce = useReducedMotion();

//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setNotice(`Thanks! This prototype does not submit ${email} yet.`);
//   }

//   function handleProvider(name: string) {
//     setNotice(`${name} sign-in is not available in this prototype yet.`);
//   }

//   const fadeUp = (i: number) =>
//     reduce
//       ? {}
//       : {
//           initial: { opacity: 0, y: 30 },
//           animate: { opacity: 1, y: 0 },
//           transition: { duration: 1, delay: 0.4 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] as const },
//         };

//   return (
//     <section
//       id="product"
//       className="relative isolate flex min-h-[calc(100vh-72px)] w-full items-center justify-center overflow-hidden bg-[#030303] px-4 pb-28 pt-20 md:px-6"
//     >
//       {/* Ambient colour wash */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/[0.07] via-transparent to-rose-500/[0.07] blur-3xl"
//       />

//       {/* Floating glass shapes */}
//       <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
//         <ElegantShape
//           reduce={!!reduce}
//           delay={0.3}
//           width={600}
//           height={140}
//           rotate={12}
//           gradient="from-indigo-500/[0.15]"
//           className="left-[-10%] top-[15%] md:left-[-5%] md:top-[20%]"
//         />
//         <ElegantShape
//           reduce={!!reduce}
//           delay={0.5}
//           width={500}
//           height={120}
//           rotate={-15}
//           gradient="from-rose-500/[0.15]"
//           className="right-[-5%] top-[70%] md:right-[0%] md:top-[75%]"
//         />
//         <ElegantShape
//           reduce={!!reduce}
//           delay={0.4}
//           width={300}
//           height={80}
//           rotate={-8}
//           gradient="from-violet-500/[0.15]"
//           className="bottom-[5%] left-[5%] md:bottom-[10%] md:left-[10%]"
//         />
//         <ElegantShape
//           reduce={!!reduce}
//           delay={0.6}
//           width={200}
//           height={60}
//           rotate={20}
//           gradient="from-amber-500/[0.15]"
//           className="right-[15%] top-[10%] md:right-[20%] md:top-[15%]"
//         />
//         <ElegantShape
//           reduce={!!reduce}
//           delay={0.7}
//           width={150}
//           height={40}
//           rotate={-25}
//           gradient="from-cyan-500/[0.15]"
//           className="left-[20%] top-[5%] md:left-[25%] md:top-[10%]"
//         />
//       </div>

//       {/* Edge vignette */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/70"
//       />

//       {/* Content */}
//       <div className="relative z-10 mx-auto w-full max-w-[1100px] text-center">
//         <motion.div {...fadeUp(0)}>
//           <span className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70 md:mb-10">
//             <span className="h-2 w-2 rounded-full bg-gradient-to-br from-indigo-400 to-rose-400" />
//             Lexiva Intelligence Space
//           </span>
//         </motion.div>

//         <motion.h1
//           {...fadeUp(1)}
//           className="mx-auto max-w-[1000px] text-balance text-[48px] font-semibold leading-[1.02] tracking-[-0.055em] sm:text-[76px] lg:text-[100px]"
//         >
//           <span className="bg-gradient-to-b from-white to-white/75 bg-clip-text text-transparent">
//             Every model.
//           </span>
//           <br />
//           <span className="bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 bg-clip-text text-transparent">
//             one intelligent space.
//           </span>
//         </motion.h1>

//         <motion.p
//           {...fadeUp(2)}
//           className="mx-auto mt-6 max-w-[600px] text-balance text-[18px] leading-[1.55] tracking-tight text-white/60 sm:text-[21px]"
//         >
//           Explore AI models through one focused chat experience. Compare
//           perspectives and always know which model powers each response.
//         </motion.p>

//         <motion.div id="signup" {...fadeUp(3)} className="mx-auto mt-10 max-w-[540px]">
//           <div className="grid gap-3 sm:grid-cols-2">
//             <button
//               type="button"
//               onClick={() => handleProvider('Google')}
//               className="inline-flex h-[60px] items-center justify-center gap-3 rounded-full border border-white/[0.18] bg-white/[0.04] text-[16px] font-medium text-white backdrop-blur transition hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
//             >
//               <GoogleIcon /> Google
//             </button>
//             <button
//               type="button"
//               onClick={() => handleProvider('Microsoft')}
//               className="inline-flex h-[60px] items-center justify-center gap-3 rounded-full border border-white/[0.18] bg-white/[0.04] text-[16px] font-medium text-white backdrop-blur transition hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
//             >
//               <MicrosoftIcon /> Microsoft
//             </button>
//           </div>

//           <div className="my-4 flex items-center gap-4 text-[14px] text-white/50">
//             <span className="h-px flex-1 bg-white/[0.12]" />
//             or
//             <span className="h-px flex-1 bg-white/[0.12]" />
//           </div>

//           <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
//             <label className="sr-only" htmlFor="work-email">
//               Your email
//             </label>
//             <input
//               id="work-email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               placeholder="Your email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               className="h-[56px] min-w-0 flex-1 rounded-[12px] border border-white/[0.15] bg-white/[0.05] px-4 text-[16px] text-white outline-none placeholder:text-white/40 focus-visible:border-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-300/30"
//             />
//             <button
//               type="submit"
//               className="inline-flex h-[56px] shrink-0 items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-[#0E0D14] transition-colors hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
//             >
//               Get product updates
//             </button>
//           </form>

//           {notice && (
//             <div
//               role="status"
//               className="mt-4 rounded-2xl border border-white/[0.12] bg-white/[0.06] px-5 py-3 text-[14px] text-white/80 backdrop-blur"
//             >
//               {notice}
//             </div>
//           )}
//           <p className="mt-3 text-[12px] text-white/50">
//             AI provider connections are not configured in this prototype yet.
//           </p>
//         </motion.div>
//       </div>

//       {/* Ask Lexiva */}
//       <Link
//         href="/chat"
//         className="absolute bottom-6 right-6 z-20 hidden items-center gap-3 rounded-full border border-white/[0.18] bg-white/[0.06] px-5 py-3 text-[15px] font-medium text-white backdrop-blur transition hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 md:inline-flex"
//       >
//         <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-rose-400 text-[11px] text-white">
//           ✦
//         </span>
//         Ask Lexiva
//       </Link>

//       <p className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45 sm:block">
//         Many perspectives. One conversation.
//       </p>
//     </section>
//   );
// }

// function GoogleIcon() {
//   return (
//     <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden="true">
//       <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5Z" />
//       <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.8c4.3-4 6.9-9.9 6.9-17.2Z" />
//       <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1Z" />
//       <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.8c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48Z" />
//     </svg>
//   );
// }

// function MicrosoftIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
//       <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" />
//       <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" />
//       <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
//       <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
//     </svg>
//   );
// }
// 'use client';

// import React, { FormEvent, useEffect, useState } from 'react';
// import Link from 'next/link';
// import { motion, useReducedMotion } from 'framer-motion';
// import { InkOrbitSculpture } from '@/components/ui/ink-orbit-sculpture';

// const ACCENTS = ['one intelligent space.', 'every perspective.', 'clear attribution.'];

// export function Hero() {
//   const [email, setEmail] = useState('');
//   const [notice, setNotice] = useState<string | null>(null);
//   const [wordIx, setWordIx] = useState(0);
//   const reduce = useReducedMotion();

//   useEffect(() => {
//     if (reduce) return;
//     const t = setInterval(() => setWordIx((i) => (i + 1) % ACCENTS.length), 3600);
//     return () => clearInterval(t);
//   }, [reduce]);

//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setNotice(`Thanks! This prototype does not submit ${email} yet.`);
//   }

//   const rise = (delay: number) =>
//     reduce
//       ? {}
//       : {
//           initial: { opacity: 0, y: 12 },
//           animate: { opacity: 1, y: 0 },
//           transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] as const },
//         };

//   return (
//     <section
//       id="product"
//       className="relative isolate w-full overflow-hidden bg-[#0A0A0C] p-2 [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_10px)] sm:p-3 lg:p-4"
//     >
//       <div className="grid w-full overflow-hidden border border-white/[0.1] bg-[#0B0B0E] lg:grid-cols-2">
//         <div className="flex min-w-0 flex-col justify-start pb-8 pt-8 lg:pt-10">
//           <div className="border-y border-white/[0.1] bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-transparent px-5 py-5 sm:px-8 lg:px-12">
//             <motion.p
//               {...rise(0)}
//               className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300"
//             >
//               Lexiva Intelligence Space
//             </motion.p>
//             <motion.h1
//               {...rise(0.08)}
//               className="text-[28px] font-medium leading-[1.1] tracking-[-0.04em] text-white sm:whitespace-nowrap sm:text-[42px] xl:text-[56px]"
//             >
//               <span className="block">Every model.</span>

//               <span className="grid" aria-live="polite">
//                 {ACCENTS.map((text, i) => (
//                   <span
//                     key={text}
//                     aria-hidden={i !== wordIx}
//                     className={`hero-gradient col-start-1 row-start-1 inline-block transition-[opacity,filter,transform] duration-500 motion-reduce:transition-none ${
//                       i === wordIx
//                         ? 'opacity-100 blur-0 translate-y-0'
//                         : 'pointer-events-none opacity-0 blur-[8px] translate-y-2'
//                     }`}
//                   >
//                     {text}
//                   </span>
//                 ))}
//               </span>
//             </motion.h1>
//           </div>

//           <div className="px-5 pt-5 sm:px-8 lg:px-12">
//             <motion.p
//               {...rise(0.16)}
//               className="max-w-[48ch] text-[16px] leading-[1.6] text-white/65"
//             >
//               Explore AI models through one focused chat experience. Compare
//               perspectives and always know which model powers each response.
//             </motion.p>

//             <motion.div {...rise(0.24)} className="mt-5 flex flex-wrap items-center gap-5">
//               <Link
//                 href="/chat"
//                 className="group inline-flex items-center gap-2 rounded-[2px] bg-white px-5 py-3 text-[14px] font-medium text-[#0E0D14] shadow-[0_0_0_3px_#0B0B0E,0_0_0_4px_rgba(255,255,255,0.3)] transition hover:-translate-y-px hover:shadow-[0_0_0_3px_#0B0B0E,0_0_0_4px_#ffffff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300 motion-reduce:transition-none"
//               >
//                 Start a conversation
//                 <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-[3px]" fill="none" aria-hidden="true">
//                   <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               </Link>

//               <Link
//                 href="/models"
//                 className="group relative inline-flex items-center gap-2 rounded-[2px] border border-white/[0.2] bg-white/[0.04] px-5 py-3 text-[14px] font-medium text-white transition hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300 motion-reduce:transition-none"
//               >
//                 <Corner className="-left-1.5 -top-1.5 border-l border-t" />
//                 <Corner className="-right-1.5 -top-1.5 border-r border-t" />
//                 <Corner className="-bottom-1.5 -left-1.5 border-b border-l" />
//                 <Corner className="-bottom-1.5 -right-1.5 border-b border-r" />
//                 Explore models
//               </Link>
//             </motion.div>

//             <motion.div id="signup" {...rise(0.3)} className="mt-6 max-w-[480px]">
//               <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
//                 <label className="sr-only" htmlFor="work-email">
//                   Your email
//                 </label>
//                 <input
//                   id="work-email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   placeholder="Your email"
//                   value={email}
//                   onChange={(event) => setEmail(event.target.value)}
//                   className="h-11 min-w-0 flex-1 rounded-[2px] border border-white/[0.15] bg-white/[0.05] px-4 text-[15px] text-white outline-none placeholder:text-white/40 focus-visible:border-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-300/30"
//                 />
//                 <button
//                   type="submit"
//                   className="inline-flex h-11 shrink-0 items-center justify-center rounded-[2px] border border-white/[0.2] bg-white/[0.06] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-white/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
//                 >
//                   Get product updates
//                 </button>
//               </form>
//               {notice && (
//                 <div
//                   role="status"
//                   className="mt-3 border border-white/[0.12] bg-white/[0.06] px-4 py-3 text-[14px] text-white/80"
//                 >
//                   {notice}
//                 </div>
//               )}
//               <p className="mt-2 text-[12px] text-white/50">
//                 AI provider connections are not configured in this prototype yet.
//               </p>
//             </motion.div>

//             <motion.div {...rise(0.36)} className="mt-5 flex items-center gap-3 text-[12.5px] text-white/50">
//               <span className="flex shrink-0">
//                 {['GPT', 'CL', 'GM', '+'].map((t, i) => (
//                   <span
//                     key={t}
//                     className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0B0B0E] bg-white/[0.1] text-[9px] font-semibold text-white/75 first:ml-0"
//                     style={{ zIndex: 4 - i }}
//                   >
//                     {t}
//                   </span>
//                 ))}
//               </span>
//               <span>Designed for many providers · none connected yet</span>
//             </motion.div>
//           </div>
//         </div>

//         <div className="relative h-[380px] min-w-0 border-t border-white/[0.1] lg:h-auto lg:min-h-[560px] lg:border-l lg:border-t-0">
//           <div className="absolute inset-0">
//             <InkOrbitSculpture seed={7} />
//           </div>
//         </div>
//       </div>

//       <p className="pb-20 pt-4 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-white/45 sm:py-4">
//         Many perspectives. One conversation.
//       </p>
//     </section>
//   );
// }

// function Corner({ className }: { className: string }) {
//   return (
//     <span
//       aria-hidden="true"
//       className={`pointer-events-none absolute h-2.5 w-2.5 border-white/40 transition-all duration-300 group-hover:border-white ${className}`}
//     />
//   );
// }


'use client';

import React, { FormEvent, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';

const ACCENTS = ['one intelligent space.', 'every perspective.', 'clear attribution.'];

/* ---------- little pure helpers ---------- */

const lookAt = (ex: number, ey: number, tx: number, ty: number, max: number, reach: number) => {
  const dx = tx - ex;
  const dy = ty - ey;
  const d = Math.hypot(dx, dy);
  if (!Number.isFinite(d) || d < 1e-6) return { x: 0, y: 0 };
  const k = (max * Math.min(1, d / reach)) / d;
  return { x: dx * k, y: dy * k };
};

/* ---------- characters (same family as the footer crew) ---------- */

type Eye = { x: number; y: number; r: number; pupil: number; max: number };
type Char = {
  id: string;
  x: number;
  y: number;
  s: number;
  flip: 1 | -1;
  name: string;
  says: string;
  box: { l: number; r: number; t: number; b: number };
  eyes: Eye[];
  idle?: string;
  body: (hatch: string) => React.ReactNode;
};

const YETI = (hatch: string) => (
  <>
    <ellipse className="dch-shadow" cx="0" cy="2" rx="54" ry="5" />
    <path d="M-30 -104 C-40 -112 -44 -124 -40 -138 C-32 -129 -22 -122 -13 -114 Z" />
    <path d="M18 -114 C26 -124 36 -130 47 -133 C45 -120 41 -110 32 -101 Z" />
    <path d="M-44 -2 C-54 -28 -54 -66 -42 -90 C-32 -110 -14 -118 2 -118 C22 -118 40 -108 48 -88 C58 -64 58 -28 48 -2 C30 4 -26 4 -44 -2 Z" />
    <path d="M40 -96 C54 -66 54 -30 46 -4 C40 -2 34 -1 30 0 C40 -30 42 -64 33 -101 Z" fill={hatch} stroke="none" />
    <path className="n thin" d="M-14 -24 l-3 4 M8 -40 l3 4 M14 -46 l3 3 M20 -30 l3 3" />
    <path className="n" d="M-48 -62 C-22 -50 10 -32 49 -26 M-50 -52 C-24 -40 8 -22 49 -16" />
    <path d="M-46 -60 C-62 -50 -63 -29 -51 -19 C-45 -15 -38 -19 -40 -28 C-43 -36 -40 -46 -36 -52" />
    <path d="M46 -58 C61 -46 61 -26 51 -18 C45 -14 38 -18 40 -26 C43 -34 41 -44 37 -50" />
    <path d="M-37 -2 C-41 -14 -23 -19 -16 -7 C-14 0 -26 4 -37 -2 Z" />
    <path d="M37 -2 C41 -14 23 -19 16 -7 C14 0 26 4 37 -2 Z" />
    <path className="n" d="M-23 -98 L-9 -96 M6 -98 L20 -100" />
    <path className="n" d="M-12 -70 C-6 -64 6 -64 12 -71" />
    <path d="M3 -66.5 L5.5 -60 L8 -67.5 Z" />
  </>
);

const BIRD = (hatch: string) => (
  <>
    <path className="n" d="M-5 0 L-5 -7 M-9 0 L-1 0 M5 0 L5 -7 M1 0 L9 0" />
    <path d="M-17 -16 C-26 -18 -31 -14 -33 -9 C-26 -10 -20 -8 -15 -10 Z" />
    <path d="M-18 -14 C-20 -30 -10 -40 2 -40 C16 -40 22 -28 20 -16 C18 -6 8 -4 0 -4 C-10 -4 -17 -8 -18 -14 Z" />
    <path d="M-11 -25 C-3 -26 1 -18 -3 -13 C-9 -12 -15 -17 -11 -25 Z" fill={hatch} />
    <path className="o" d="M19 -30 L29 -27 L19 -23 Z" />
    <path className="a" d="M-3 -38 L4 -59 L12 -37 Z" />
    <circle cx="4" cy="-60" r="2.8" />
  </>
);

const CAT = (hatch: string) => (
  <>
    <ellipse className="dch-shadow" cx="4" cy="2" rx="32" ry="4" />
    <g className="dch-tail">
      <path d="M18 -4 C42 -4 52 -24 46 -44 C44 -51 36 -53 34 -46 C40 -30 34 -16 16 -14 Z" />
    </g>
    <path d="M-22 0 C-28 -18 -24 -42 -14 -52 L14 -52 C24 -42 28 -18 22 0 C10 3 -10 3 -22 0 Z" />
    <path d="M14 -46 C24 -36 26 -16 22 0 C18 1 14 2 12 2 C16 -14 16 -32 10 -46 Z" fill={hatch} stroke="none" />
    <path className="n" d="M-8 -30 L-9 -1 M8 -30 L9 -1" />
    <path d="M-16 1 C-16 -5 -3 -5 -3 1 Z M3 1 C3 -5 16 -5 16 1 Z" />
    <path className="a" d="M-18 -55 C-6 -49 6 -49 18 -55 L17 -46 C6 -40 -6 -40 -17 -46 Z" />
    <path d="M-22 -86 L-25 -107 L-7 -96 Z" />
    <path d="M8 -96 L23 -108 L22 -86 Z" />
    <path d="M-26 -70 C-28 -88 -16 -98 0 -98 C16 -98 28 -88 26 -70 C24 -56 12 -50 0 -50 C-12 -50 -24 -56 -26 -70 Z" />
    <ellipse className="k" cx="-10" cy="-76" rx="7.5" ry="6.5" />
    <path className="k" d="M-2.5 -68 L2.5 -68 L0 -64.5 Z" />
    <path className="n" d="M0 -64.5 C-1 -60.5 -5 -60.5 -6 -62.5 M0 -64.5 C1 -60.5 5 -60.5 6 -62.5" />
    <path className="n thin" d="M-15 -66 L-29 -68 M-15 -63 L-28 -59 M15 -66 L29 -68 M15 -63 L28 -59" />
  </>
);

const GHOST = (hatch: string) => (
  <>
    <path d="M-23 -14 L-23 -40 C-23 -59 -12 -67 0 -67 C12 -67 23 -59 23 -40 L23 -14 C12 -10 -12 -10 -23 -14 Z" />
    <path d="M13 -61 C21 -54 23 -46 23 -36 L23 -15 L15 -13 L15 -36 C15 -46 15 -54 13 -61 Z" fill={hatch} stroke="none" />
    <path className="k" d="M-5 -33 C-3 -27 4 -27 6 -33 Z" />
  </>
);

const CHARS: Char[] = [
  {
    id: 'ghost', x: 312, y: 300, s: 1.5, flip: 1, name: 'Boo', says: 'Which model answered? I will tell you.',
    box: { l: -26, r: 26, t: -70, b: -22 }, idle: 'dch-bob',
    eyes: [{ x: -8, y: -44, r: 6.5, pupil: 3.2, max: 3 }, { x: 9, y: -44, r: 6.5, pupil: 3.2, max: 3 }],
    body: GHOST,
  },
  {
    id: 'yeti', x: 130, y: 430, s: 1.45, flip: 1, name: 'Bruno', says: 'Ask me about models!',
    box: { l: -72, r: 60, t: -140, b: 6 },
    eyes: [{ x: -15, y: -86, r: 8, pupil: 3.6, max: 3.6 }, { x: 13, y: -88, r: 8, pupil: 3.6, max: 3.6 }],
    body: YETI,
  },
  {
    id: 'bird', x: 420, y: 252, s: 1.5, flip: 1, name: 'Pip', says: 'No provider yet, but soon.',
    box: { l: -34, r: 30, t: -62, b: 2 }, idle: 'dch-peck',
    eyes: [{ x: 3, y: -30, r: 4.6, pupil: 2.3, max: 2 }, { x: 12, y: -31, r: 4.6, pupil: 2.3, max: 2 }],
    body: BIRD,
  },
  {
    id: 'cat', x: 548, y: 430, s: 1.3, flip: -1, name: 'Patch', says: 'Try the chat preview.',
    box: { l: -30, r: 52, t: -110, b: 4 },
    eyes: [{ x: 10, y: -76, r: 6, pupil: 2.8, max: 2.6 }],
    body: CAT,
  },
];

const DOODLES = [
  { k: 'star', x: 8, y: 10, s: 26, d: 0 },
  { k: 'sparkle', x: 82, y: 8, s: 30, d: 1.2 },
  { k: 'heart', x: 90, y: 38, s: 24, d: 2.1 },
  { k: 'bolt', x: 6, y: 42, s: 24, d: 0.6 },
  { k: 'sparkle', x: 55, y: 6, s: 20, d: 1.8 },
];

const DoodleShape = ({ k }: { k: string }) => {
  if (k === 'star') return <path fill="#ffd23f" d="M0 -13 L3.6 -4.4 L13 -4 L5.8 2.2 L8.2 12 L0 6.6 L-8.2 12 L-5.8 2.2 L-13 -4 L-3.6 -4.4 Z" />;
  if (k === 'heart') return <path fill="#ff5c7a" d="M0 11 C-6 6 -13 1 -13 -5 C-13 -10 -8 -13 -4 -11 C-2 -10 -1 -8 0 -6 C1 -8 2 -10 4 -11 C8 -13 13 -10 13 -5 C13 1 6 6 0 11 Z" />;
  if (k === 'bolt') return <path fill="#ffd23f" d="M3 -14 L-8 2 L-1 2 L-4 14 L8 -3 L1 -3 Z" />;
  return <path fill="#8fdcff" d="M0 -13 C1 -4 4 -1 13 0 C4 1 1 4 0 13 C-1 4 -4 1 -13 0 C-4 -1 -1 -4 0 -13 Z" />;
};

/* ---------- hero ---------- */

export function Hero() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [wordIx, setWordIx] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [talking, setTalking] = useState(-1);
  const [hopping, setHopping] = useState(-1);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const timer = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setWordIx((i) => (i + 1) % ACCENTS.length), 3600);
    return () => clearInterval(t);
  }, [reduced]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(`Thanks! This prototype does not submit ${email} yet.`);
  }

  // Eyes follow the pointer
  function onPointerMove(e: React.PointerEvent) {
    const svg = svgRef.current;
    if (!svg || reduced) return;
    const m = svg.getScreenCTM();
    if (!m) return;
    const inv = m.inverse();
    const tx = inv.a * e.clientX + inv.c * e.clientY + inv.e;
    const ty = inv.b * e.clientX + inv.d * e.clientY + inv.f;
    CHARS.forEach((c, ci) => {
      c.eyes.forEach((eye, ei) => {
        const ex = c.x + eye.x * c.s * c.flip;
        const ey = c.y + eye.y * c.s;
        const o = lookAt(ex, ey, tx, ty, eye.max, 260);
        svg
          .querySelector(`[data-pupil="${ci}-${ei}"]`)
          ?.setAttribute('transform', `translate(${(o.x * c.flip).toFixed(2)} ${o.y.toFixed(2)})`);
      });
    });
  }

  function poke(i: number) {
    setTalking(i);
    setHopping(-1);
    requestAnimationFrame(() => setHopping(i));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setTalking(-1);
      setHopping(-1);
    }, 2600);
  }

  const hatch = `url(#${uid}-hatch)`;

  return (
    <section
      id="product"
      className="dch relative isolate w-full overflow-hidden bg-[#0A0A0C] p-2 sm:p-3 lg:p-4"
      onPointerMove={onPointerMove}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="dch-panel grid w-full overflow-hidden lg:grid-cols-2">
        {/* ---------- Copy ---------- */}
        <div className="flex min-w-0 flex-col justify-start pb-8 pt-8 lg:pt-10">
          <div className="dch-band px-5 py-5 sm:px-8 lg:px-12">
            <p className="dch-rise mb-3 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#a5b4fc]" style={{ ['--d' as string]: '0ms' }}>
              <span className="dch-tick" aria-hidden="true" />
              Lexiva Intelligence Space
            </p>
            <h1
              className="dch-rise text-[28px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#f4f1ea] sm:whitespace-nowrap sm:text-[42px] xl:text-[56px]"
              style={{ ['--d' as string]: '80ms' }}
            >
              <span className="block">Every model.</span>
              <span className="grid" aria-live="polite">
                {ACCENTS.map((text, i) => (
                  <span
                    key={text}
                    aria-hidden={i !== wordIx}
                    className={`dch-accent col-start-1 row-start-1 inline-block transition-[opacity,filter,transform] duration-500 motion-reduce:transition-none ${
                      i === wordIx ? 'opacity-100 blur-0 translate-y-0' : 'pointer-events-none opacity-0 blur-[8px] translate-y-2'
                    }`}
                  >
                    {text}
                    <svg className="dch-scribble" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M2 6 C25 1 40 9 65 5 S110 1 135 5 S180 9 198 4" />
                    </svg>
                  </span>
                ))}
              </span>
            </h1>
          </div>

          <div className="px-5 pt-5 sm:px-8 lg:px-12">
            <p className="dch-rise max-w-[48ch] text-[16px] leading-[1.6] text-[#f4f1ea]/65" style={{ ['--d' as string]: '160ms' }}>
              Explore AI models through one focused chat experience. Compare
              perspectives and always know which model powers each response.
            </p>

            <div className="dch-rise mt-6 flex flex-wrap items-center gap-4" style={{ ['--d' as string]: '240ms' }}>
              <Link href="/chat" className="dch-btn is-solid">
                <svg className="dch-ico" viewBox="-16 -16 32 32" width="18" height="18" aria-hidden="true">
                  <DoodleShape k="bolt" />
                </svg>
                Start a conversation
              </Link>
              <Link href="/models" className="dch-btn is-outline">
                <svg className="dch-ico" viewBox="-16 -16 32 32" width="18" height="18" aria-hidden="true">
                  <DoodleShape k="sparkle" />
                </svg>
                Explore models
              </Link>
            </div>

            <div id="signup" className="dch-rise mt-6 max-w-[480px]" style={{ ['--d' as string]: '320ms' }}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="work-email">Your email</label>
                <input
                  id="work-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="dch-input h-11 min-w-0 flex-1 px-4 text-[15px] text-[#f4f1ea] placeholder:text-[#f4f1ea]/40"
                />
                <button type="submit" className="dch-btn is-outline !h-11 shrink-0 !px-5 !text-[14px]">
                  Get product updates
                </button>
              </form>
              {notice && (
                <div role="status" className="dch-note mt-3 px-4 py-3 text-[14px] text-[#f4f1ea]/85">
                  {notice}
                </div>
              )}
              <p className="mt-2 text-[12px] text-[#f4f1ea]/50">
                AI provider connections are not configured in this prototype yet.
              </p>
            </div>

            <div className="dch-rise mt-5 flex items-center gap-3 text-[12.5px] text-[#f4f1ea]/50" style={{ ['--d' as string]: '400ms' }}>
              <span className="flex shrink-0">
                {['GPT', 'CL', 'GM', '+'].map((t, i) => (
                  <span
                    key={t}
                    className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f4f1ea]/70 bg-[#0B0B0E] text-[9px] font-semibold text-[#f4f1ea]/80 first:ml-0"
                    style={{ zIndex: 4 - i }}
                  >
                    {t}
                  </span>
                ))}
              </span>
              <span>Designed for many providers · none connected yet</span>
            </div>
          </div>
        </div>

        {/* ---------- Doodle scene ---------- */}
        <div className="dch-scene relative min-w-0">
          <svg
            ref={svgRef}
            viewBox="0 0 640 520"
            className="block h-auto w-full select-none"
            role="group"
            aria-label="Hand-drawn Lexiva crew standing around a chat window sketch"
          >
            <defs>
              <pattern id={`${uid}-hatch`} width="4.6" height="4.6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
                <line x1="0" y1="0" x2="0" y2="4.6" stroke="#f4f1ea" strokeWidth="1.25" />
              </pattern>
            </defs>

            {/* ground */}
            <g className="dch-ground">
              <path d="M16 436 Q90 430 170 437 T330 435 T490 438 T624 434" />
              <path className="thin" d="M60 436 l2 -9 M64 436 l1 -12 M68 436 l-1 -7 M250 437 l2 -9 M254 437 l1 -12 M420 438 l2 -9 M424 438 l1 -12 M590 435 l2 -9" />
              <ellipse cx="220" cy="452" rx="7" ry="4" />
              <ellipse cx="470" cy="456" rx="9" ry="4.5" />
              <ellipse cx="90" cy="458" rx="5" ry="3" />
            </g>

            {/* ghost behind the window */}
            {[CHARS[0]].map((c) => (
              <Crew key={c.id} c={c} idx={0} hatch={hatch} hop={hopping === 0} />
            ))}

            {/* chat window sketch (no fake replies) */}
            <g className="dch-window">
              <rect x="250" y="252" width="230" height="178" rx="14" />
              <path d="M250 284 H480" />
              <circle cx="270" cy="268" r="4" />
              <circle cx="284" cy="268" r="4" />
              <circle cx="298" cy="268" r="4" />
              <path className="thin" d="M272 308 H380 M272 326 H420 M272 344 H350" />
              <rect x="268" y="384" width="194" height="30" rx="15" />
              <text x="284" y="404" className="dch-ph">Ask anything…</text>
            </g>

            {CHARS.map((c, i) =>
              i === 0 ? null : <Crew key={c.id} c={c} idx={i} hatch={hatch} hop={hopping === i} />
            )}

            {CHARS.map((c, i) => {
              const bx = c.flip > 0 ? [c.box.l, c.box.r] : [-c.box.r, -c.box.l];
              return (
                <rect
                  key={'hit' + c.id}
                  className="dch-hit"
                  x={c.x + bx[0] * c.s}
                  y={c.y + c.box.t * c.s}
                  width={(bx[1] - bx[0]) * c.s}
                  height={(c.box.b - c.box.t) * c.s}
                  rx={12}
                  role="button"
                  tabIndex={0}
                  aria-label={`${c.name}: ${c.says}`}
                  onClick={() => poke(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      poke(i);
                    }
                  }}
                />
              );
            })}
          </svg>

          {/* speech bubble */}
          <div className="pointer-events-none absolute inset-0" aria-live="polite">
            {CHARS.map((c, i) =>
              talking === i ? (
                <div
                  key={c.id}
                  className="dch-bubble"
                  style={{
                    left: `${(c.x / 640) * 100}%`,
                    top: `${((c.y + c.box.t * c.s - 6) / 520) * 100}%`,
                    transform: c.x > 460 ? 'translate(-88%,-100%) rotate(2deg)' : 'translate(-50%,-100%) rotate(-2deg)',
                  }}
                >
                  {c.says}
                </div>
              ) : null
            )}
          </div>

          {/* drifting doodles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {DOODLES.map((d, i) => (
              <span
                key={i}
                className="dch-float absolute"
                style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, animationDelay: `${d.d}s` }}
              >
                <svg viewBox="-16 -16 32 32" width={d.s} height={d.s} className="dch-doodle">
                  <DoodleShape k={d.k} />
                </svg>
              </span>
            ))}
          </div>

          <p className="dch-cap absolute bottom-3 left-4">Concept sketch · not a live chat</p>
        </div>
      </div>

      <p className="pb-20 pt-4 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-[#f4f1ea]/45 sm:py-4">
        Many perspectives. One conversation.
      </p>
    </section>
  );
}

function Crew({ c, idx, hatch, hop }: { c: Char; idx: number; hatch: string; hop: boolean }) {
  return (
    <g transform={`translate(${c.x} ${c.y}) scale(${c.s * c.flip} ${c.s})`}>
      <g className={'dch-hopper' + (hop ? ' is-hop' : '')}>
        <g className={'dch-art' + (c.idle ? ' ' + c.idle : '')}>
          {c.body(hatch)}
          {c.eyes.map((eye, e) => (
            <g key={e} className="dch-eye">
              {eye.r > 0 && <circle cx={eye.x} cy={eye.y} r={eye.r} />}
              <g data-pupil={`${idx}-${e}`}>
                <circle className="k" cx={eye.x} cy={eye.y} r={eye.pupil} />
                <circle className="dch-glint" cx={eye.x + eye.pupil * 0.35} cy={eye.y - eye.pupil * 0.4} r={eye.pupil * 0.32} />
              </g>
            </g>
          ))}
        </g>
      </g>
    </g>
  );
}

const CSS = `
.dch{--ink:#f4f1ea;--bg:#0B0B0E;--accent:#a5b4fc;background-image:repeating-linear-gradient(135deg,rgba(244,241,234,.05) 0 1px,transparent 1px 10px)}
.dch-panel{border:2px dashed rgba(244,241,234,.28);background:var(--bg)}
.dch-band{border-top:1.5px dashed rgba(244,241,234,.25);border-bottom:1.5px dashed rgba(244,241,234,.25);background:linear-gradient(90deg,rgba(244,241,234,.07),transparent)}
.dch-tick{width:9px;height:9px;border:2px solid var(--accent);border-radius:99px;transform:rotate(-8deg)}
.dch-accent{position:relative;background:linear-gradient(100deg,#a5b4fc 8%,#d8b4fe 50%,#fda4af 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.dch-scribble{position:absolute;left:0;right:0;bottom:-6px;width:100%;height:8px;overflow:visible}
.dch-scribble path{fill:none;stroke:var(--accent);stroke-width:2.4;stroke-linecap:round}
.dch-btn{display:inline-flex;align-items:center;gap:8px;height:46px;padding:0 20px 0 16px;border-radius:999px;border:2px solid var(--ink);font-size:14.5px;font-weight:750;letter-spacing:-.01em;box-shadow:0 3px 0 var(--ink);transition:transform .18s cubic-bezier(.3,1.4,.5,1),box-shadow .18s cubic-bezier(.3,1.4,.5,1)}
.dch-btn.is-outline{background:var(--bg);color:var(--ink)}
.dch-btn.is-solid{background:var(--ink);color:var(--bg);box-shadow:0 3px 0 var(--accent)}
.dch-btn:hover{transform:translateY(-2px) rotate(-1.2deg);box-shadow:0 5px 0 var(--ink)}
.dch-btn.is-solid:hover{box-shadow:0 5px 0 var(--accent)}
.dch-btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--ink);transition-duration:.06s}
.dch-btn:focus-visible,.dch-input:focus-visible{outline:2px dashed var(--ink);outline-offset:4px}
.dch-ico{stroke:var(--ink);stroke-width:1.9;stroke-linejoin:round;stroke-linecap:round}
.dch-btn.is-solid .dch-ico{stroke:var(--bg)}
.dch-btn:hover .dch-ico{animation:dch-wiggle .5s ease-in-out}
.dch-input{background:transparent;border:2px solid rgba(244,241,234,.5);border-radius:14px;outline:none}
.dch-input:focus{border-color:var(--accent)}
.dch-note{border:2px dashed rgba(244,241,234,.35);border-radius:14px}
.dch-scene{border-top:1.5px dashed rgba(244,241,234,.25);background:radial-gradient(60% 55% at 50% 60%,rgba(244,241,234,.05),transparent)}
@media (min-width:1024px){.dch-scene{border-top:0;border-left:1.5px dashed rgba(244,241,234,.25)}}
.dch-scene svg{max-width:none;overflow:visible}
.dch-ground path,.dch-ground ellipse{fill:none;stroke:var(--ink);stroke-width:2.4;stroke-linecap:round}
.dch-ground .thin{stroke-width:1.8}
.dch-ground ellipse{fill:var(--bg);stroke-width:1.6}
.dch-window rect,.dch-window path,.dch-window circle{fill:var(--bg);stroke:var(--ink);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.dch-window path{fill:none}.dch-window .thin{stroke-width:1.6;opacity:.7}
.dch-window circle{fill:var(--ink);stroke:none}
.dch-window rect:nth-of-type(2){fill:none;stroke-width:1.8}
.dch-ph{fill:var(--ink);opacity:.45;font-size:13px}
.dch-art{fill:var(--bg);stroke:var(--ink);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.dch-art .n{fill:none}.dch-art .k{fill:var(--ink)}.dch-art .a{fill:var(--accent)}.dch-art .o{fill:#ff9f1c}
.dch-art .thin{stroke-width:1.5}
.dch-art .dch-glint{fill:var(--bg);stroke:none}
.dch-art .dch-shadow{fill:var(--ink);stroke:none;opacity:.14}
.dch-eye{transform-box:fill-box;transform-origin:50% 50%;animation:dch-blink 5s infinite}
.dch-art.dch-bob{animation:dch-bob 3.2s ease-in-out infinite}
.dch-art.dch-peck{transform-box:fill-box;transform-origin:50% 100%;animation:dch-peck 5.5s ease-in-out infinite}
.dch-tail{transform-box:fill-box;transform-origin:0% 100%;animation:dch-tail 2.8s ease-in-out infinite}
.dch-hopper{transform-box:fill-box;transform-origin:50% 100%}
.dch-hopper.is-hop{animation:dch-hop .62s cubic-bezier(.3,.7,.4,1)}
.dch-hit{fill:transparent;stroke:none;cursor:pointer;outline:none}
.dch-hit:focus-visible{stroke:var(--ink);stroke-width:2.5;stroke-dasharray:6 6}
.dch-bubble{position:absolute;background:var(--bg);color:var(--ink);border:2px solid var(--ink);border-radius:16px;padding:7px 12px;font-size:13px;font-weight:700;line-height:1.25;white-space:nowrap;box-shadow:3px 3px 0 var(--accent);animation:dch-bubble .32s cubic-bezier(.3,1.6,.5,1) both}
.dch-float{animation:dch-drift 6s ease-in-out infinite}
.dch-doodle{display:block;stroke:var(--ink);stroke-width:1.9;stroke-linejoin:round;stroke-linecap:round}
.dch-cap{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(244,241,234,.4)}
.dch-rise{animation:dch-rise .7s cubic-bezier(.2,.8,.3,1) var(--d,0ms) both}
@keyframes dch-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes dch-blink{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}
@keyframes dch-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes dch-peck{0%,62%,100%{transform:none}66%{transform:rotate(14deg) translateY(2px)}70%{transform:none}74%{transform:rotate(12deg) translateY(2px)}78%{transform:none}}
@keyframes dch-tail{0%,100%{transform:rotate(0)}50%{transform:rotate(-12deg)}}
@keyframes dch-hop{0%{transform:none}18%{transform:scale(1.12,.84)}45%{transform:translateY(-28%) scale(.94,1.08)}72%{transform:translateY(0) scale(1.1,.88)}86%{transform:scale(.97,1.03)}100%{transform:none}}
@keyframes dch-bubble{from{opacity:0;scale:.6}to{opacity:1;scale:1}}
@keyframes dch-drift{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-12px) rotate(8deg)}}
@keyframes dch-wiggle{0%,100%{transform:none}30%{transform:rotate(-14deg) scale(1.15)}60%{transform:rotate(10deg)}}
@media (max-width:480px){.dch-btn{height:42px;font-size:13.5px;padding:0 16px 0 13px}.dch-bubble{font-size:12px;padding:6px 10px}}
@media (prefers-reduced-motion:reduce){.dch *,.dch *::before,.dch *::after{animation:none!important;transition:none!important}}
`;