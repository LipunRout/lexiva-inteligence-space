'use client';

import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero() {
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(`Thanks! This prototype does not submit ${email} yet.`);
  }

  function handleProvider(name: string) {
    setNotice(`${name} sign-in is not available in this prototype yet.`);
  }

  return (
    <section
      id="product"
      className="relative isolate min-h-[820px] overflow-hidden bg-white px-4 pb-24 pt-[120px] sm:pt-[150px] xl:min-h-[880px] xl:pt-[240px]"
    >
      <Decor />

      <div className="relative z-10 mx-auto max-w-[1100px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6156D9]">
            Lexiva Intelligence Space
          </p>
          <h1 className="mx-auto text-[52px] font-medium leading-[1.02] tracking-[-0.055em] text-[#17171B] sm:text-[80px] lg:text-[104px]">
            Every model.
            <br />
            <span className="hero-gradient">one intelligent</span> space.
          </h1>
          <p className="mx-auto mt-6 max-w-[600px] text-[18px] leading-[1.5] text-[#696873] sm:text-[22px]">
            Explore AI models through one focused chat experience. Compare
            perspectives and always know which model powers each response.
          </p>
        </motion.div>

        <motion.div
          id="signup"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mx-auto mt-10 max-w-[540px]"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleProvider('Google')}
              className="inline-flex h-[64px] items-center justify-center gap-3 rounded-full border border-[#2B2933]/70 bg-white text-[16px] font-medium text-[#17171B] transition hover:bg-[#F7F6FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7468EB]"
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              onClick={() => handleProvider('Microsoft')}
              className="inline-flex h-[64px] items-center justify-center gap-3 rounded-full border border-[#2B2933]/70 bg-white text-[16px] font-medium text-[#17171B] transition hover:bg-[#F7F6FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7468EB]"
            >
              <MicrosoftIcon /> Microsoft
            </button>
          </div>

          <div className="my-4 flex items-center gap-4 text-[14px] text-[#696873]">
            <span className="h-px flex-1 bg-[#D9D8DE]" />
            or
            <span className="h-px flex-1 bg-[#D9D8DE]" />
          </div>

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
              className="h-[56px] min-w-0 flex-1 rounded-[6px] border border-[#C9C7D0] bg-white px-4 text-[16px] text-[#17171B] outline-none placeholder:text-[#92909B] focus-visible:border-[#7468EB] focus-visible:ring-2 focus-visible:ring-[#7468EB]/30"
            />
            <button
              type="submit"
              className="inline-flex h-[56px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#0E0D14] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#2A2740] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7468EB]"
            >
              Get product updates
            </button>
          </form>

          {notice && (
            <div
              role="status"
              className="mt-4 rounded-2xl border border-[#DAD8F5] bg-white px-5 py-3 text-[14px] text-[#37334F] shadow-[0_8px_30px_rgba(43,38,86,0.07)]"
            >
              {notice}
            </div>
          )}
          <p className="mt-3 text-[12px] text-[#85838F]">
            AI provider connections are not configured in this prototype yet.
          </p>
        </motion.div>
      </div>

      <Link
        href="/chat"
        className="absolute bottom-6 right-6 z-20 hidden items-center gap-3 rounded-full border border-[#2B2933]/70 bg-white px-5 py-3 text-[15px] font-medium text-[#17171B] shadow-[0_6px_24px_rgba(42,38,70,0.08)] transition hover:bg-[#F7F6FA] md:inline-flex"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#6559DB] to-[#ED78B6] text-[11px] text-white">
          ✦
        </span>
        Ask Lexiva
      </Link>

      <p className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9896A0] sm:block">
        Many perspectives. One conversation.
      </p>
    </section>
  );
}

/* ---------- Decorative layer: fixed 1440px canvas, centered ---------- */

function Decor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
      <div className="absolute left-1/2 top-0 h-full w-[1440px] -translate-x-1/2">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 880" fill="none">
          <defs>
            <linearGradient id="lx-flow" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59BC8" />
              <stop offset=".5" stopColor="#D9A6F0" />
              <stop offset="1" stopColor="#F59BC8" />
            </linearGradient>
          </defs>
          <g stroke="url(#lx-flow)" strokeWidth="1.5" strokeLinecap="round">
            {/* bubble -> avatars */}
            <path d="M370 170H430Q450 170 450 150V140Q450 120 470 120H562" />
            {/* avatars -> node */}
            <path d="M714 125H840Q860 125 860 145V165Q860 185 880 185H928" />
            {/* node -> right card */}
            <path d="M952 185H1215Q1235 185 1235 205V268" />
            {/* right card -> bottom */}
            <path d="M1235 362V400Q1235 420 1255 420H1280Q1300 420 1300 440V620Q1300 640 1280 640H1230Q1210 640 1210 660V880" />
            {/* bubble -> doc card */}
            <path d="M140 238V480Q140 500 160 500Q190 500 190 530V700" />
          </g>
          <g fill="#2B2933">
            <circle cx="370" cy="170" r="3" />
            <circle cx="140" cy="238" r="3" />
            <circle cx="1235" cy="268" r="3" />
            <circle cx="1235" cy="362" r="3" />
            <circle cx="190" cy="700" r="3" />
          </g>
        </svg>

        {/* Speech-bubble card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute left-[100px] top-[105px] h-[135px] w-[270px] -rotate-[2deg]"
        >
          <div className="h-full w-full rounded-[22px] border border-[#E4E2E9] bg-white p-4 shadow-[0_8px_28px_rgba(42,38,70,0.06)]">
            <p className="text-[24px] font-medium leading-[1.1] tracking-[-0.03em] text-[#17171B]">
              Explore a new
              <br />
              perspective
            </p>
          </div>
          <span className="absolute -bottom-[10px] left-6 h-5 w-5 rotate-45 border-b border-l border-[#E4E2E9] bg-white" />
          <span className="absolute bottom-[-18px] right-[96px] flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[#E4E2E9] bg-white shadow-[0_6px_18px_rgba(42,38,70,0.08)]">
            <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[14px] bg-gradient-to-br from-[#6559DB] to-[#A468DF] text-[16px] text-white">
              ✦
            </span>
          </span>
          <span className="absolute bottom-[8px] right-[-6px] rounded-[6px] bg-[#DDD9FC] px-2.5 py-1 text-[14px] font-medium text-[#3F36A8]">
            Compare
          </span>
        </motion.div>

        {/* Avatar pill */}
        <div className="absolute left-[562px] top-[92px] flex items-center rounded-full border border-[#E8E6EF] bg-white p-1.5 shadow-[0_5px_20px_rgba(42,38,70,0.06)]">
          <Avatar initials="AL" color="bg-[#D9D3FF]" />
          <Avatar initials="MR" color="bg-[#FAD7E7]" />
          <Avatar initials="JS" color="bg-[#D9EFCB]" />
        </div>

        {/* Node */}
        <div className="absolute left-[928px] top-[168px] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#E4E2E9] bg-white shadow-[0_4px_14px_rgba(42,38,70,0.06)]">
          <span className="h-3 w-3 rounded-[3px] bg-gradient-to-br from-[#6559DB] to-[#ED78B6]" />
        </div>

        {/* Right card */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute left-[1110px] top-[268px] w-[250px] rotate-[-2deg] rounded-[12px] border border-[#E4E2E9] bg-white p-3.5 shadow-[0_8px_28px_rgba(42,38,70,0.06)]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0EDFF] text-[18px] text-[#6559DB]">
              ◆
            </span>
            <div>
              <span className="inline-block rounded-[3px] bg-[#E3DFFF] px-1.5 py-0.5 text-[12px] font-medium text-[#3F36A8]">
                Model attribution
              </span>
              <p className="mt-1 text-[13px] text-[#4A4856]">Know which model answered</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom-left doc card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute left-[70px] top-[700px] w-[250px] rotate-[1deg] rounded-[14px] border border-[#E4E2E9] bg-white px-4 pb-6 pt-3 shadow-[0_8px_28px_rgba(42,38,70,0.06)]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#E7F3FF] text-[#2C6FD1]">
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                <path d="M5 3h7l3 3v11H5V3Zm3 7h4M8 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[26px] font-medium tracking-[-0.03em] text-[#17171B]">History</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span className={`-ml-2 flex h-[44px] w-[44px] items-center justify-center rounded-full border-2 border-white text-[12px] font-semibold text-[#454156] first:ml-0 ${color}`}>
      {initials}
    </span>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.8c4.3-4 6.9-9.9 6.9-17.2Z" />
      <path fill="#FBBC05" d="M10.4 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6.1Z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.8c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.500 42.600 14.600 48 24 48Z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <rect x="2" y="2" width="9.500" height="9.500" fill="#F25022" />
      <rect x="12.500" y="2" width="9.500" height="9.500" fill="#7FBA00" />
      <rect x="2" y="12.500" width="9.500" height="9.500" fill="#00A4EF" />
      <rect x="12.500" y="12.500" width="9.500" height="9.500" fill="#FFB900" />
    </svg>
  );
}