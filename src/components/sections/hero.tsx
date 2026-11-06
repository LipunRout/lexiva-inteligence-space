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
'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { InkOrbitSculpture } from '@/components/ui/ink-orbit-sculpture';

const ACCENTS = ['one intelligent space.', 'every perspective.', 'clear attribution.'];

export function Hero() {
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [wordIx, setWordIx] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setWordIx((i) => (i + 1) % ACCENTS.length), 3600);
    return () => clearInterval(t);
  }, [reduce]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(`Thanks! This prototype does not submit ${email} yet.`);
  }

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] as const },
        };

  return (
    <section
      id="product"
      className="relative isolate w-full overflow-hidden bg-[#0A0A0C] p-2 [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_10px)] sm:p-3 lg:p-4"
    >
      <div className="grid w-full overflow-hidden border border-white/[0.1] bg-[#0B0B0E] lg:grid-cols-2">
        <div className="flex min-w-0 flex-col justify-start pb-8 pt-8 lg:pt-10">
          <div className="border-y border-white/[0.1] bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-transparent px-5 py-5 sm:px-8 lg:px-12">
            <motion.p
              {...rise(0)}
              className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300"
            >
              Lexiva Intelligence Space
            </motion.p>
            <motion.h1
              {...rise(0.08)}
              className="text-[28px] font-medium leading-[1.1] tracking-[-0.04em] text-white sm:whitespace-nowrap sm:text-[42px] xl:text-[56px]"
            >
              <span className="block">Every model.</span>

              <span className="grid" aria-live="polite">
                {ACCENTS.map((text, i) => (
                  <span
                    key={text}
                    aria-hidden={i !== wordIx}
                    className={`hero-gradient col-start-1 row-start-1 inline-block transition-[opacity,filter,transform] duration-500 motion-reduce:transition-none ${
                      i === wordIx
                        ? 'opacity-100 blur-0 translate-y-0'
                        : 'pointer-events-none opacity-0 blur-[8px] translate-y-2'
                    }`}
                  >
                    {text}
                  </span>
                ))}
              </span>
            </motion.h1>
          </div>

          <div className="px-5 pt-5 sm:px-8 lg:px-12">
            <motion.p
              {...rise(0.16)}
              className="max-w-[48ch] text-[16px] leading-[1.6] text-white/65"
            >
              Explore AI models through one focused chat experience. Compare
              perspectives and always know which model powers each response.
            </motion.p>

            <motion.div {...rise(0.24)} className="mt-5 flex flex-wrap items-center gap-5">
              <Link
                href="/chat"
                className="group inline-flex items-center gap-2 rounded-[2px] bg-white px-5 py-3 text-[14px] font-medium text-[#0E0D14] shadow-[0_0_0_3px_#0B0B0E,0_0_0_4px_rgba(255,255,255,0.3)] transition hover:-translate-y-px hover:shadow-[0_0_0_3px_#0B0B0E,0_0_0_4px_#ffffff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300 motion-reduce:transition-none"
              >
                Start a conversation
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-[3px]" fill="none" aria-hidden="true">
                  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link
                href="/models"
                className="group relative inline-flex items-center gap-2 rounded-[2px] border border-white/[0.2] bg-white/[0.04] px-5 py-3 text-[14px] font-medium text-white transition hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300 motion-reduce:transition-none"
              >
                <Corner className="-left-1.5 -top-1.5 border-l border-t" />
                <Corner className="-right-1.5 -top-1.5 border-r border-t" />
                <Corner className="-bottom-1.5 -left-1.5 border-b border-l" />
                <Corner className="-bottom-1.5 -right-1.5 border-b border-r" />
                Explore models
              </Link>
            </motion.div>

            <motion.div id="signup" {...rise(0.3)} className="mt-6 max-w-[480px]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="work-email">
                  Your email
                </label>
                <input
                  id="work-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 min-w-0 flex-1 rounded-[2px] border border-white/[0.15] bg-white/[0.05] px-4 text-[15px] text-white outline-none placeholder:text-white/40 focus-visible:border-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-300/30"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-[2px] border border-white/[0.2] bg-white/[0.06] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-white/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
                >
                  Get product updates
                </button>
              </form>
              {notice && (
                <div
                  role="status"
                  className="mt-3 border border-white/[0.12] bg-white/[0.06] px-4 py-3 text-[14px] text-white/80"
                >
                  {notice}
                </div>
              )}
              <p className="mt-2 text-[12px] text-white/50">
                AI provider connections are not configured in this prototype yet.
              </p>
            </motion.div>

            <motion.div {...rise(0.36)} className="mt-5 flex items-center gap-3 text-[12.5px] text-white/50">
              <span className="flex shrink-0">
                {['GPT', 'CL', 'GM', '+'].map((t, i) => (
                  <span
                    key={t}
                    className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0B0B0E] bg-white/[0.1] text-[9px] font-semibold text-white/75 first:ml-0"
                    style={{ zIndex: 4 - i }}
                  >
                    {t}
                  </span>
                ))}
              </span>
              <span>Designed for many providers · none connected yet</span>
            </motion.div>
          </div>
        </div>

        <div className="relative h-[380px] min-w-0 border-t border-white/[0.1] lg:h-auto lg:min-h-[560px] lg:border-l lg:border-t-0">
          <div className="absolute inset-0">
            <InkOrbitSculpture seed={7} />
          </div>
        </div>
      </div>

      <p className="pb-20 pt-4 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-white/45 sm:py-4">
        Many perspectives. One conversation.
      </p>
    </section>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-2.5 w-2.5 border-white/40 transition-all duration-300 group-hover:border-white ${className}`}
    />
  );
}