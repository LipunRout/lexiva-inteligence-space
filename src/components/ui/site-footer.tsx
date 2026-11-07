'use client';

import * as React from 'react';
import NextLink from 'next/link';

/* ---------- pure helpers ---------- */

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

const layoutWord = (advances: number[], tracking: number, size: number) => {
  const x: number[] = [];
  const w: number[] = [];
  let at = 0;
  const gap = tracking * size;
  advances.forEach((a, i) => {
    const adv = Number.isFinite(a) && a > 0 ? a : 0;
    x.push(at);
    w.push(adv);
    at += adv + (i < advances.length - 1 ? gap : 0);
  });
  return { x, w, width: Math.max(0, at) };
};

type Seat = 'front' | 'top' | 'behind';

const seatPoint = (seat: Seat, lx: number, lw: number, cap: number, offset: number, scale: number) => {
  const x = lx + lw * (0.5 + offset);
  if (seat === 'top') return { x, y: -cap };
  if (seat === 'behind') return { x, y: -cap + 30 * scale };
  return { x, y: 0 };
};

const lookAt = (ex: number, ey: number, tx: number, ty: number, max: number, reach: number) => {
  const dx = tx - ex;
  const dy = ty - ey;
  const d = Math.hypot(dx, dy);
  if (!Number.isFinite(d) || d < 1e-6) return { x: 0, y: 0 };
  const k = (max * Math.min(1, d / reach)) / d;
  return { x: dx * k, y: dy * k };
};

type Floater = { x: number; y: number; vx: number; vy: number; rot: number; vr: number; fall: number; phase: number; pop: number };

const stepFloater = (f: Floater, dt: number, t: number, w: number, h: number, px: number, py: number, radius: number, rand: () => number) => {
  const step = clamp(dt, 0, 0.05);
  const m = 40;
  if (f.pop > 0) {
    f.pop -= step;
    if (f.pop <= 0) {
      f.pop = 0;
      f.x = rand() * w;
      f.y = -m;
      f.vx = 0;
      f.vy = f.fall;
    }
    return;
  }
  const sway = Math.sin(t * 0.7 + f.phase) * 14;
  if (Number.isFinite(px) && Number.isFinite(py)) {
    const dx = f.x - px;
    const dy = f.y - py;
    const d = Math.hypot(dx, dy);
    if (d < radius && d > 0.01) {
      const k = (1 - d / radius) * (1 - d / radius) * 2400;
      f.vx += (dx / d) * k * step;
      f.vy += (dy / d) * k * step;
      f.vr += (dx > 0 ? 1 : -1) * k * 0.004 * step;
    }
  }
  const ease = Math.min(1, step * 2.4);
  f.vx += (sway - f.vx) * ease;
  f.vy += (f.fall - f.vy) * ease;
  f.vr += (Math.sin(f.phase * 3) * 18 - f.vr) * Math.min(1, step * 0.8);
  f.x += f.vx * step;
  f.y += f.vy * step;
  f.rot = (f.rot + f.vr * step) % 360;
  if (f.y > h + m) {
    f.y = -m;
    f.x = rand() * w;
  } else if (f.y < -m * 3) f.y = h + m;
  if (f.x < -m) f.x = w + m;
  else if (f.x > w + m) f.x = -m;
};

const timeline = (letters: number, crew: number, words: number, actions: number) => {
  const letter = (i: number) => 160 + i * 80;
  const crewStart = letter(Math.max(0, letters - 1)) + 420;
  const member = (j: number) => crewStart + j * 130;
  const copy = crewStart + 260;
  const word = (k: number) => copy + k * 45;
  const actionsStart = word(words) + 120;
  const action = (k: number) => actionsStart + k * 110;
  return { ground: 60, letter, member, doodles: crewStart + Math.max(0, crew - 1) * 65, word, action };
};

/* ---------- Lexiva content ---------- */

type DoodleKind = 'flame' | 'star' | 'heart' | 'bolt' | 'sparkle' | 'spiral' | 'plane';
type CrewKind = 'yeti' | 'kid' | 'bird' | 'cat' | 'ghost' | 'mushroom';

type CrewMember = { kind: CrewKind; letter: number; seat?: Seat; offset?: number; flip?: boolean; name: string; says: string };

const WORDMARK = 'LEXIVA';
const BRAND = 'Lexiva';
const BLURB =
  'One intelligent space to explore, compare and work with multiple AI models. This is a prototype: no AI provider is connected yet.';
const TAGLINE = 'Many perspectives. One conversation.';

const COLUMNS: { title: string; links: { label: string; href?: string }[] }[] = [
  {
    title: 'Workspace',
    links: [
      { label: 'Chat', href: '/chat' },
      { label: 'Models', href: '/models' },
      { label: 'Compare', href: '/compare' },
      { label: 'History', href: '/history' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Why Lexiva', href: '/#about' },
      { label: 'How it works', href: '/#workflow' },
    ],
  },
  {
    title: 'Status',
    links: [
      { label: 'Chat: local preview' },
      { label: 'Providers: planned' },
      { label: 'Compare: planned' },
      { label: 'History: planned' },
    ],
  },
];

const ACTIONS: { label: string; href: string; icon: DoodleKind; variant: 'solid' | 'outline' }[] = [
  { label: 'Explore models', href: '/models', icon: 'sparkle', variant: 'outline' },
  { label: 'Start a conversation', href: '/chat', icon: 'bolt', variant: 'solid' },
];

const CREW: CrewMember[] = [
  { kind: 'yeti', letter: 0, seat: 'front', offset: -0.32, name: 'Bruno', says: 'Ask me about models!' },
  { kind: 'bird', letter: 1, seat: 'top', offset: 0.02, name: 'Pip', says: 'No provider yet, but soon.' },
  { kind: 'mushroom', letter: 2, seat: 'front', offset: 0.12, name: 'Morel', says: 'Compare answers side by side.' },
  { kind: 'ghost', letter: 3, seat: 'behind', offset: 0, name: 'Boo', says: 'Your chats stay in this browser.' },
  { kind: 'kid', letter: 4, seat: 'top', offset: -0.05, name: 'Juno', says: 'Up here! Best view of the prototype.' },
  { kind: 'cat', letter: 5, seat: 'front', offset: 0.35, flip: true, name: 'Patch', says: 'Try the chat preview.' },
];

const DOODLES: DoodleKind[] = ['star', 'sparkle', 'heart', 'bolt', 'spiral', 'plane', 'flame', 'sparkle'];

const COLORS = { background: '#050508', ink: '#f4f1ea', accent: '#a5b4fc' };

const ACCENT = { flame: '#ff7a1a', flameCore: '#ffd23f', gold: '#ffd23f', heart: '#ff5c7a' };

/* ---------- crew drawings ---------- */

type Eye = { x: number; y: number; r: number; pupil: number; max: number };
type Art = {
  k: number;
  box: { l: number; r: number; t: number; b: number };
  eyes: Eye[];
  seat: Seat;
  body: (hatch: string) => React.ReactNode;
  front?: () => React.ReactNode;
  idle?: string;
};

const ART: Record<CrewKind, Art> = {
  yeti: {
    k: 1,
    box: { l: -72, r: 60, t: -140, b: 6 },
    seat: 'front',
    eyes: [
      { x: -15, y: -86, r: 8, pupil: 3.6, max: 3.6 },
      { x: 13, y: -88, r: 8, pupil: 3.6, max: 3.6 },
    ],
    body: (hatch) => (
      <>
        <ellipse className="dcf-shadow" cx="0" cy="2" rx="54" ry="5" />
        <path d="M-40 -92 C-62 -92 -70 -76 -68 -56 L-66 -30 C-64 -18 -54 -16 -44 -20 Z" />
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
    ),
  },
  kid: {
    k: 1.28,
    box: { l: -30, r: 30, t: -88, b: 42 },
    seat: 'top',
    eyes: [
      { x: -6, y: -58, r: 0, pupil: 2.5, max: 1.8 },
      { x: 6.5, y: -58, r: 0, pupil: 2.5, max: 1.8 },
    ],
    body: (hatch) => (
      <>
        <path d="M-15 -6 L-3 -6 C-3 8 -5 20 -6 30 L-15 30 C-15 18 -16 6 -15 -6 Z" />
        <path d="M3 -6 L15 -6 C17 6 19 16 22 27 L12 30 C10 18 6 6 3 -6 Z" />
        <path d="M3 -6 L15 -6 C17 6 19 16 22 27 L12 30 C10 18 6 6 3 -6 Z" fill={hatch} stroke="none" />
        <path className="k" d="M-17 30 C-20 34 -20 40 -14 41 L-2 41 C2 40 0 34 -5 30 Z" />
        <path className="k" d="M11 29 C8 34 10 40 16 40 L26 38 C29 36 27 30 22 27 Z" />
        <path d="M-20 -4 C-22 -20 -18 -38 -10 -44 L10 -44 C18 -38 22 -20 20 -4 Z" />
        <path className="n thick" d="M-19.5 -14 L19.5 -14 M-18.5 -26 L18.5 -26 M-14 -36 L14 -36" />
        <path className="n" d="M-18 -36 C-28 -28 -30 -14 -26 -5" />
        <circle cx="-26" cy="-3" r="4" />
        <path className="n" d="M18 -36 C27 -30 30 -18 28 -7" />
        <circle cx="28" cy="-4" r="4" />
        <circle cx="-17" cy="-58" r="4" />
        <circle cx="17" cy="-58" r="4" />
        <circle cx="0" cy="-60" r="17" />
        <path className="n" d="M-5 -50 C-2 -47 2 -47 5 -50" />
        <path d="M-15 -70 C-14 -87 14 -87 15 -70 Z" />
        <path d="M-27 -68 C-16 -75 16 -75 27 -68 C18 -63 -18 -63 -27 -68 Z" />
      </>
    ),
  },
  bird: {
    k: 1.22,
    box: { l: -34, r: 30, t: -62, b: 2 },
    seat: 'top',
    idle: 'dcf-peck',
    eyes: [
      { x: 3, y: -30, r: 4.6, pupil: 2.3, max: 2 },
      { x: 12, y: -31, r: 4.6, pupil: 2.3, max: 2 },
    ],
    body: (hatch) => (
      <>
        <path className="n" d="M-5 0 L-5 -7 M-9 0 L-1 0 M5 0 L5 -7 M1 0 L9 0" />
        <path d="M-17 -16 C-26 -18 -31 -14 -33 -9 C-26 -10 -20 -8 -15 -10 Z" />
        <path d="M-18 -14 C-20 -30 -10 -40 2 -40 C16 -40 22 -28 20 -16 C18 -6 8 -4 0 -4 C-10 -4 -17 -8 -18 -14 Z" />
        <path d="M-11 -25 C-3 -26 1 -18 -3 -13 C-9 -12 -15 -17 -11 -25 Z" fill={hatch} />
        <path className="o" d="M19 -30 L29 -27 L19 -23 Z" />
        <path className="a" d="M-3 -38 L4 -59 L12 -37 Z" />
        <circle cx="4" cy="-60" r="2.8" />
      </>
    ),
  },
  cat: {
    k: 1.06,
    box: { l: -30, r: 52, t: -110, b: 4 },
    seat: 'front',
    eyes: [{ x: 10, y: -76, r: 6, pupil: 2.8, max: 2.6 }],
    body: (hatch) => (
      <>
        <ellipse className="dcf-shadow" cx="4" cy="2" rx="32" ry="4" />
        <g className="dcf-tail">
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
    ),
  },
  ghost: {
    k: 1.3,
    box: { l: -26, r: 26, t: -70, b: 0 },
    seat: 'behind',
    idle: 'dcf-bob',
    eyes: [
      { x: -8, y: -44, r: 6.5, pupil: 3.2, max: 3 },
      { x: 9, y: -44, r: 6.5, pupil: 3.2, max: 3 },
    ],
    body: (hatch) => (
      <>
        <path d="M-23 -14 L-23 -40 C-23 -59 -12 -67 0 -67 C12 -67 23 -59 23 -40 L23 -14 C12 -10 -12 -10 -23 -14 Z" />
        <path d="M13 -61 C21 -54 23 -46 23 -36 L23 -15 L15 -13 L15 -36 C15 -46 15 -54 13 -61 Z" fill={hatch} stroke="none" />
        <path className="k" d="M-5 -33 C-3 -27 4 -27 6 -33 Z" />
      </>
    ),
    front: () => (
      <>
        <path d="M-25 -32 C-27 -38 -21 -42 -17 -38 C-15 -42 -10 -41 -10 -36 L-11 -30 C-15 -28 -22 -28 -25 -32 Z" />
        <path d="M25 -32 C27 -38 21 -42 17 -38 C15 -42 10 -41 10 -36 L11 -30 C15 -28 22 -28 25 -32 Z" />
      </>
    ),
  },
  mushroom: {
    k: 1.12,
    box: { l: -27, r: 27, t: -56, b: 4 },
    seat: 'front',
    idle: 'dcf-sway',
    eyes: [
      { x: -4.5, y: -16, r: 0, pupil: 1.9, max: 1.3 },
      { x: 4.5, y: -16, r: 0, pupil: 1.9, max: 1.3 },
    ],
    body: (hatch) => (
      <>
        <ellipse className="dcf-shadow" cx="0" cy="2" rx="18" ry="3" />
        <path d="M-10 0 C-12 -10 -10 -22 -8 -28 L8 -28 C10 -22 12 -10 10 0 C4 2 -4 2 -10 0 Z" />
        <path d="M5 -27 C9 -20 11 -10 10 0 C8 1 6 1.5 4 1.5 C6 -8 6 -18 2 -27 Z" fill={hatch} stroke="none" />
        <path className="r" d="M-25 -28 C-27 -45 -12 -55 0 -55 C12 -55 27 -45 25 -28 C14 -23 -14 -23 -25 -28 Z" />
        <circle cx="-12" cy="-40" r="4.2" />
        <circle cx="6" cy="-46" r="3.4" />
        <circle cx="15" cy="-34" r="3" />
        <path className="n" d="M-2 -10 C-1 -8 1 -8 2 -10" />
      </>
    ),
  },
};

const Doodle = ({ kind }: { kind: DoodleKind }) => {
  switch (kind) {
    case 'flame':
      return (
        <>
          <path fill={ACCENT.flame} d="M0 14 C-9 14 -12 6 -10 0 C-8 -5 -4 -6 -4 -12 C1 -9 3 -5 2 -1 C4 -3 5 -6 5 -8 C10 -3 11 4 8 9 C6 12 3 14 0 14 Z" />
          <path fill={ACCENT.flameCore} d="M0 11.5 C-4 11.5 -6 8 -5 5 C-4 2 -1 1 -1 -3 C2 -1 4 3 3 6 C4 5 5 4 5 3 C7 6 5 11.5 0 11.5 Z" />
        </>
      );
    case 'star':
      return <path fill={ACCENT.gold} d="M0 -13 L3.6 -4.4 L13 -4 L5.8 2.2 L8.2 12 L0 6.6 L-8.2 12 L-5.8 2.2 L-13 -4 L-3.6 -4.4 Z" />;
    case 'heart':
      return <path fill={ACCENT.heart} d="M0 11 C-6 6 -13 1 -13 -5 C-13 -10 -8 -13 -4 -11 C-2 -10 -1 -8 0 -6 C1 -8 2 -10 4 -11 C8 -13 13 -10 13 -5 C13 1 6 6 0 11 Z" />;
    case 'bolt':
      return <path fill={ACCENT.gold} d="M3 -14 L-8 2 L-1 2 L-4 14 L8 -3 L1 -3 Z" />;
    case 'sparkle':
      return <path fill="#8fdcff" d="M0 -13 C1 -4 4 -1 13 0 C4 1 1 4 0 13 C-1 4 -4 1 -13 0 C-4 -1 -1 -4 0 -13 Z" />;
    case 'spiral':
      return <path fill="none" d="M0 0 C2 -2 4 0 3 3 C1 6 -4 5 -5 1 C-6 -4 -1 -8 4 -7 C9 -5 10 2 7 6" />;
    case 'plane':
      return (
        <>
          <path className="dcf-paperfill" d="M-13 -1 L13 -10 L4 12 L0 3 Z" />
          <path fill="none" d="M0 3 L13 -10 M0 3 L-2 9 L2 5" />
        </>
      );
  }
};

/* ---------- font measuring ---------- */

const FONT_SIZE = 200;
type Metrics = { advances: number[]; cap: number };

const estimate = (word: string): Metrics => ({
  advances: Array.from(word).map((c) => (/[IJ1]/.test(c) ? 0.42 : /[MW]/.test(c) ? 0.98 : 0.76) * FONT_SIZE),
  cap: 0.73 * FONT_SIZE,
});

const measure = (word: string, family: string): Metrics | null => {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return null;
  ctx.font = '900 ' + FONT_SIZE + 'px ' + family;
  const chars = Array.from(word);
  const advances: number[] = [];
  let prev = 0;
  for (let i = 0; i < chars.length; i++) {
    const w = ctx.measureText(chars.slice(0, i + 1).join('')).width;
    advances.push(w - prev);
    prev = w;
  }
  const m = ctx.measureText(word);
  const cap = m.actualBoundingBoxAscent > 0 ? m.actualBoundingBoxAscent : 0.73 * FONT_SIZE;
  return { advances, cap };
};

const useIso = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/* ---------- link ---------- */

function FLink({ label, href }: { label: string; href?: string }) {
  if (!href) return <span className="dcf-link is-static">{label}</span>;
  return (
    <NextLink href={href} className="dcf-link">
      <span>{label}</span>
      <svg className="dcf-squiggle" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength={1} d="M1 5 C10 1 16 7 25 4 S40 1 50 4 S66 7 75 4 S90 1 99 4" />
      </svg>
    </NextLink>
  );
}

/* ---------- footer ---------- */

export function SiteFooter() {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const chars = React.useMemo(() => Array.from(WORDMARK), []);
  const tracking = -0.02;

  const rootRef = React.useRef<HTMLElement | null>(null);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const worldRef = React.useRef<HTMLDivElement | null>(null);
  const doodleRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const [metrics, setMetrics] = React.useState<Metrics>(() => estimate(WORDMARK));
  const [play, setPlay] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const [talking, setTalking] = React.useState(-1);
  const [hopping, setHopping] = React.useState(-1);
  const talkTimer = React.useRef(0);

  // Measure with the site's own font so nothing changes your typography
  useIso(() => {
    const run = () => {
      const family = rootRef.current ? getComputedStyle(rootRef.current).fontFamily : 'sans-serif';
      const m = measure(WORDMARK, family);
      if (m) setMetrics(m);
    };
    run();
    const fonts = document.fonts;
    if (!fonts) return;
    let alive = true;
    fonts.ready.then(() => alive && run());
    return () => {
      alive = false;
    };
  }, []);

  const layout = React.useMemo(() => layoutWord(metrics.advances, tracking, FONT_SIZE), [metrics]);
  const cap = metrics.cap;

  const placed = React.useMemo(
    () =>
      CREW.map((m, i) => {
        const art = ART[m.kind];
        const li = clamp(m.letter, 0, chars.length - 1);
        const scale = (cap / 144) * art.k;
        const seat = m.seat || art.seat;
        const p = seatPoint(seat, layout.x[li], layout.w[li], cap, m.offset ?? 0, scale);
        return { i, m, art, seat, scale, ...p, flip: m.flip ? -1 : 1 };
      }),
    [chars.length, layout, cap]
  );

  const view = React.useMemo(() => {
    let l = 0;
    let r = layout.width;
    let t = -cap;
    let b = 30;
    for (const p of placed) {
      const bx = p.flip > 0 ? [p.art.box.l, p.art.box.r] : [-p.art.box.r, -p.art.box.l];
      l = Math.min(l, p.x + bx[0] * p.scale);
      r = Math.max(r, p.x + bx[1] * p.scale);
      t = Math.min(t, p.y + p.art.box.t * p.scale);
      b = Math.max(b, p.y + p.art.box.b * p.scale);
    }
    const pad = 24;
    return { x: l - pad, y: t - pad, w: r - l + pad * 2, h: b - t + pad * 2 };
  }, [layout, placed, cap]);

  const words = TAGLINE.split(/\s+/);
  const tl = timeline(chars.length, placed.length, words.length, ACTIONS.length);

  const ground = React.useMemo(() => {
    const x0 = view.x + 6;
    const x1 = view.x + view.w - 6;
    let d = 'M' + x0.toFixed(1) + ' 6';
    const n = 14;
    for (let k = 1; k <= n; k++) {
      const x = x0 + ((x1 - x0) * k) / n;
      d += ' Q' + (x - (x1 - x0) / n / 2).toFixed(1) + ' ' + (6 + (hash(k * 3.1) - 0.5) * 5).toFixed(1) + ' ' + x.toFixed(1) + ' ' + (6 + (hash(k * 7.7) - 0.5) * 2).toFixed(1);
    }
    let tufts = '';
    for (let k = 0; k < 22; k++) {
      const x = x0 + 20 + hash(k * 11.3) * (x1 - x0 - 40);
      const s = 0.7 + hash(k * 5.9) * 0.6;
      tufts += 'M' + x.toFixed(1) + ' 6 l' + (2 * s).toFixed(1) + ' ' + (-9 * s).toFixed(1) + ' M' + (x + 3 * s).toFixed(1) + ' 6 l' + s.toFixed(1) + ' ' + (-12 * s).toFixed(1) + ' ';
    }
    const pebbles = Array.from({ length: 9 }, (_, k) => ({
      x: x0 + 40 + hash(k * 17.1) * (x1 - x0 - 80),
      y: 14 + hash(k * 2.3) * 8,
      r: 2 + hash(k * 9.4) * 2.6,
    }));
    return { d, tufts, pebbles };
  }, [view]);

  const doodleList = React.useMemo(
    () => Array.from({ length: 12 }, (_, k) => ({ kind: DOODLES[k % DOODLES.length], size: 22 + hash(k * 4.7) * 14 })),
    []
  );

  const sim = React.useRef({
    floaters: [] as Floater[],
    w: 0,
    h: 0,
    px: NaN,
    py: NaN,
    inside: false,
    visible: false,
    gaze: [] as { tx: number; ty: number; next: number; blinkAt: number; blink: number; o: { x: number; y: number }[] }[],
    seed: 1,
    start: 0,
  });

  const paintDoodles = React.useCallback(() => {
    const s = sim.current;
    const k = clamp(s.w / 1100, 0.5, 1);
    s.floaters.forEach((f, i) => {
      const el = doodleRefs.current[i];
      if (!el) return;
      let sc = k;
      let op = 1;
      if (f.pop > 0) {
        const age = 1.4 - f.pop;
        sc = k * (1 + Math.min(1, age / 0.3) * 0.7);
        op = Math.max(0, 1 - age / 0.3);
      }
      el.style.transform = 'translate3d(' + f.x.toFixed(1) + 'px,' + f.y.toFixed(1) + 'px,0) rotate(' + f.rot.toFixed(1) + 'deg) scale(' + sc.toFixed(3) + ')';
      el.style.opacity = String(op);
    });
  }, []);

  useIso(() => {
    const el = worldRef.current;
    if (!el) return;
    const s = sim.current;
    const size = () => {
      const r = el.getBoundingClientRect();
      const ow = s.w;
      const oh = s.h;
      s.w = r.width;
      s.h = r.height;
      if (!s.floaters.length) {
        s.floaters = doodleList.map((_, k) => ({
          x: (0.04 + 0.92 * ((k + hash(k * 9.1) * 0.8) / doodleList.length)) * r.width,
          y: (0.02 + hash(k * 3.3) * 0.56) * r.height,
          vx: 0,
          vy: 0,
          rot: (hash(k * 1.7) - 0.5) * 50,
          vr: (hash(k * 6.1) - 0.5) * 30,
          fall: 9 + hash(k * 2.9) * 16,
          phase: hash(k * 8.3) * Math.PI * 2,
          pop: 0,
        }));
      } else if (ow && oh) {
        for (const f of s.floaters) {
          f.x *= r.width / ow;
          f.y *= r.height / oh;
        }
      }
      paintDoodles();
    };
    size();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(size);
    ro.observe(el);
    return () => ro.disconnect();
  }, [doodleList, paintDoodles]);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  // Storyboard starts when the footer scrolls into view
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const s = sim.current;
    if (typeof IntersectionObserver === 'undefined') {
      s.visible = true;
      setPlay(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          s.visible = e.isIntersecting;
          if (e.isIntersecting && e.intersectionRatio > 0.12) setPlay(true);
        }
      },
      { threshold: [0, 0.12, 0.3] }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (play && !sim.current.start) sim.current.start = performance.now();
  }, [play]);

  // Living loop: eyes follow the pointer, blinks, falling doodles
  React.useEffect(() => {
    const s = sim.current;
    let raf = 0;
    let last = performance.now();
    const rand = () => {
      s.seed = (s.seed * 16807) % 2147483647;
      return s.seed / 2147483647;
    };
    const svgPoint = (svg: SVGSVGElement, cx: number, cy: number) => {
      const m = svg.getScreenCTM();
      if (!m) return null;
      const inv = m.inverse();
      return { x: inv.a * cx + inv.c * cy + inv.e, y: inv.b * cx + inv.d * cy + inv.f };
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!s.visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const svg = svgRef.current;
      const world = worldRef.current;

      let target: { x: number; y: number } | null = null;
      if (svg && s.inside) target = svgPoint(svg, s.px, s.py);

      placed.forEach((p, c) => {
        const g = (s.gaze[c] ||= { tx: 0, ty: 0, next: 0, blinkAt: t + 1 + hash(c * 3.7) * 3, blink: 0, o: [] });
        if (!target && t > g.next) {
          const other = placed[(c + 1 + Math.floor(rand() * Math.max(1, placed.length - 1))) % placed.length];
          if (other && rand() < 0.45) {
            g.tx = other.x;
            g.ty = other.y - 60 * other.scale;
          } else {
            g.tx = p.x + (rand() - 0.5) * 900;
            g.ty = p.y - 80 * p.scale + (rand() - 0.5) * 500;
          }
          g.next = t + 1.4 + rand() * 2.6;
        }
        if (t > g.blinkAt) {
          g.blink = 0.16;
          g.blinkAt = t + 2.2 + rand() * 4;
        }
        g.blink = Math.max(0, g.blink - dt);
        const lid = g.blink > 0 ? 0.12 + (Math.abs(g.blink - 0.08) / 0.08) * 0.88 : 1;

        p.art.eyes.forEach((eye, e) => {
          const ex = p.x + eye.x * p.scale * p.flip;
          const ey = p.y + eye.y * p.scale;
          const o = lookAt(ex, ey, target ? target.x : g.tx, target ? target.y : g.ty, eye.max, 220);
          const prev = g.o[e] || { x: 0, y: 0 };
          const ease = Math.min(1, dt * (target ? 14 : 6));
          const nx = prev.x + (o.x * p.flip - prev.x) * ease;
          const ny = prev.y + (o.y - prev.y) * ease;
          g.o[e] = { x: nx, y: ny };
          const pupil = svg?.querySelector('[data-pupil="' + c + '-' + e + '"]');
          const blink = svg?.querySelector('[data-blink="' + c + '-' + e + '"]');
          pupil?.setAttribute('transform', 'translate(' + nx.toFixed(2) + ' ' + ny.toFixed(2) + ')');
          blink?.setAttribute('transform', 'translate(0 ' + (eye.y * (1 - lid)).toFixed(2) + ') scale(1 ' + lid.toFixed(3) + ')');
        });
      });

      if (world && s.floaters.length && s.start && now - s.start > tl.doodles) {
        const r = world.getBoundingClientRect();
        const px = s.inside ? s.px - r.left : NaN;
        const py = s.inside ? s.py - r.top : NaN;
        if (!reduced) for (const f of s.floaters) stepFloater(f, dt, t, s.w, s.h, px, py, 110, rand);
        paintDoodles();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [placed, play, reduced, tl.doodles, paintDoodles]);

  React.useEffect(() => () => window.clearTimeout(talkTimer.current), []);

  const poke = (c: number) => {
    setTalking(c);
    setHopping(-1);
    requestAnimationFrame(() => setHopping(c));
    window.clearTimeout(talkTimer.current);
    talkTimer.current = window.setTimeout(() => {
      setTalking(-1);
      setHopping(-1);
    }, 2600);
  };

  const popDoodle = (k: number) => {
    const f = sim.current.floaters[k];
    if (f && f.pop <= 0) {
      f.pop = 1.4;
      paintDoodles();
    }
  };

  const toTop = () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });

  const hatch = 'url(#' + uid + '-hatch)';
  const pct = (v: number, base: number, span: number) => (((v - base) / span) * 100).toFixed(3) + '%';

  const vars = {
    '--dcf-bg': COLORS.background,
    '--dcf-ink': COLORS.ink,
    '--dcf-accent': COLORS.accent,
  } as React.CSSProperties;

  const renderCrew = (p: (typeof placed)[number], part: 'body' | 'front') => (
    <g key={p.i + part} transform={'translate(' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ') scale(' + (p.scale * p.flip).toFixed(4) + ' ' + p.scale.toFixed(4) + ')'}>
      <g className={'dcf-arrive dcf-arrive-' + p.seat} style={{ '--d': tl.member(p.i) + 'ms' } as React.CSSProperties}>
        <g className={'dcf-hopper' + (hopping === p.i ? ' is-hop' : '')}>
          <g className={'dcf-art' + (p.art.idle ? ' ' + p.art.idle : '')}>
            {part === 'body' ? (
              <>
                {p.art.body(hatch)}
                {p.art.eyes.map((eye, e) => (
                  <g key={e} data-blink={p.i + '-' + e}>
                    {eye.r > 0 && <circle cx={eye.x} cy={eye.y} r={eye.r} />}
                    <g data-pupil={p.i + '-' + e}>
                      <circle className="k" cx={eye.x} cy={eye.y} r={eye.pupil} />
                      <circle className="dcf-glint" cx={eye.x + eye.pupil * 0.35} cy={eye.y - eye.pupil * 0.4} r={eye.pupil * 0.32} />
                    </g>
                  </g>
                ))}
              </>
            ) : (
              p.art.front?.()
            )}
          </g>
        </g>
      </g>
    </g>
  );

  return (
    <footer
      ref={rootRef}
      className="dcf"
      data-play={play || reduced ? '1' : '0'}
      style={vars}
      onPointerMove={(e) => {
        const s = sim.current;
        s.px = e.clientX;
        s.py = e.clientY;
        s.inside = true;
      }}
      onPointerLeave={() => {
        sim.current.inside = false;
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="dcf-top dcf-rise" style={{ '--d': '0ms' } as React.CSSProperties}>
        <div className="dcf-brand">
          <span className="dcf-logo" aria-hidden="true">
            <svg viewBox="-60 -150 120 120" width="30" height="30">
              <g className="dcf-art">
                <path d="M-30 -104 C-40 -112 -44 -124 -40 -138 C-32 -129 -22 -122 -13 -114 Z" />
                <path d="M18 -114 C26 -124 36 -130 47 -133 C45 -120 41 -110 32 -101 Z" />
                <path d="M-44 -30 C-54 -56 -54 -70 -42 -90 C-32 -110 -14 -118 2 -118 C22 -118 40 -108 48 -88 C58 -68 56 -54 48 -30 Z" />
                <circle className="k" cx="-15" cy="-84" r="5.5" />
                <circle className="k" cx="13" cy="-86" r="5.5" />
                <path className="n" d="M-12 -66 C-6 -60 6 -60 12 -67" />
              </g>
            </svg>
          </span>
          <span className="dcf-brandname">{BRAND}</span>
        </div>
        <p className="dcf-blurb">{BLURB}</p>
        <nav className="dcf-cols" aria-label="Footer">
          {COLUMNS.map((col) => (
            <div className="dcf-col" key={col.title}>
              <h3 className="dcf-coltitle">{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FLink label={l.label} href={l.href} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="dcf-world" ref={worldRef}>
        <div className="dcf-stage">
          <h2 className="dcf-sr">{WORDMARK}</h2>
          <svg
            ref={svgRef}
            className="dcf-svg"
            viewBox={view.x.toFixed(1) + ' ' + view.y.toFixed(1) + ' ' + view.w.toFixed(1) + ' ' + view.h.toFixed(1)}
            role="group"
            aria-label="Lexiva, meet the crew"
          >
            <defs>
              <pattern id={uid + '-hatch'} width="4.6" height="4.6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
                <line x1="0" y1="0" x2="0" y2="4.6" style={{ stroke: 'var(--dcf-ink)' }} strokeWidth="1.25" />
              </pattern>
              <filter id={uid + '-ink'} x="-4%" y="-6%" width="108%" height="112%">
                <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="11" result="edge" />
                <feDisplacementMap in="SourceGraphic" in2="edge" scale="5" xChannelSelector="R" yChannelSelector="G" result="rough" />
                <feTurbulence type="fractalNoise" baseFrequency="0.018 0.32" numOctaves="2" seed="4" result="streak" />
                <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -16 5.6" result="streakA" />
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="9" result="speck" />
                <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -24 7.0" result="speckA" />
                <feComposite in="streakA" in2="speckA" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="holes" />
                <feComposite in="rough" in2="holes" operator="out" />
              </filter>
            </defs>

            <g>
              <g className="dcf-ground">
                <path className="dcf-draw" pathLength={1} d={ground.d} style={{ '--d': tl.ground + 'ms' } as React.CSSProperties} />
                <path className="dcf-tufts dcf-fade" d={ground.tufts} style={{ '--d': tl.ground + 500 + 'ms' } as React.CSSProperties} />
                {ground.pebbles.map((pb, k) => (
                  <ellipse key={k} className="dcf-pebble dcf-fade" cx={pb.x} cy={pb.y} rx={pb.r * 1.5} ry={pb.r} style={{ '--d': tl.ground + 600 + 'ms' } as React.CSSProperties} />
                ))}
              </g>
              {placed.filter((p) => p.seat === 'behind').map((p) => renderCrew(p, 'body'))}
            </g>

            {chars.map((c, i) => (
              <g
                key={i}
                className="dcf-letter"
                style={{ '--d': tl.letter(i) + 'ms', '--r': ((hash(i * 2.3) - 0.5) * 9).toFixed(2) + 'deg' } as React.CSSProperties}
              >
                <g className="dcf-glyph">
                  <text x={layout.x[i]} y={0} fontSize={FONT_SIZE} fontWeight={900} filter={'url(#' + uid + '-ink)'}>
                    {c}
                  </text>
                </g>
                <path
                  className="dcf-dust"
                  d={'M' + (layout.x[i] - 6) + ' -6 l-16 -6 M' + (layout.x[i] - 4) + ' -16 l-12 -12 M' + (layout.x[i] + layout.w[i] + 6) + ' -6 l16 -6 M' + (layout.x[i] + layout.w[i] + 4) + ' -16 l12 -12'}
                />
              </g>
            ))}

            <g>
              {placed.filter((p) => p.seat === 'behind').map((p) => renderCrew(p, 'front'))}
              {placed.filter((p) => p.seat !== 'behind').map((p) => renderCrew(p, 'body'))}
            </g>

            {placed.map((p) => {
              const bx = p.flip > 0 ? [p.art.box.l, p.art.box.r] : [-p.art.box.r, -p.art.box.l];
              const top = p.art.box.t;
              const bottom = p.seat === 'behind' ? -30 : p.art.box.b;
              return (
                <rect
                  key={'hit' + p.i}
                  className="dcf-hit"
                  x={p.x + bx[0] * p.scale}
                  y={p.y + top * p.scale}
                  width={(bx[1] - bx[0]) * p.scale}
                  height={(bottom - top) * p.scale}
                  rx={12}
                  role="button"
                  tabIndex={0}
                  aria-label={p.m.name + ': ' + p.m.says}
                  onClick={() => poke(p.i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      poke(p.i);
                    }
                  }}
                />
              );
            })}
          </svg>

          <div className="dcf-bubbles" aria-live="polite">
            {placed.map((p) =>
              talking === p.i ? (
                <div
                  key={p.i}
                  className={'dcf-bubble' + (p.x > view.x + view.w * 0.72 ? ' is-left' : '')}
                  style={{ left: pct(p.x, view.x, view.w), top: pct(p.y + p.art.box.t * p.scale - 6, view.y, view.h) }}
                >
                  {p.m.says}
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="dcf-doodles" aria-hidden="true">
          {doodleList.map((d, k) => (
            <div
              key={k}
              className="dcf-doodle"
              ref={(el) => {
                doodleRefs.current[k] = el;
              }}
              style={{ width: d.size, height: d.size, marginLeft: -d.size / 2, marginTop: -d.size / 2 }}
              onPointerDown={() => popDoodle(k)}
            >
              <span className="dcf-doodle-in" style={{ '--d': tl.doodles + k * 70 + 'ms' } as React.CSSProperties}>
                <svg viewBox="-16 -16 32 32" width={d.size} height={d.size}>
                  <Doodle kind={d.kind} />
                </svg>
              </span>
            </div>
          ))}
        </div>

        <div className="dcf-cta">
          <p className="dcf-tagline">
            {words.map((w, k) => (
              <span key={k} className="dcf-word" style={{ '--d': tl.word(k) + 'ms' } as React.CSSProperties}>
                {w}{' '}
              </span>
            ))}
          </p>
          <div className="dcf-actions">
            {ACTIONS.map((a, k) => (
              <NextLink
                key={a.label}
                href={a.href}
                className={'dcf-btn dcf-pop ' + (a.variant === 'outline' ? 'is-outline' : 'is-solid')}
                style={{ '--d': tl.action(k) + 'ms' } as React.CSSProperties}
              >
                <svg className="dcf-icon" viewBox="-16 -16 32 32" width="18" height="18" aria-hidden="true">
                  <Doodle kind={a.icon} />
                </svg>
                <span>{a.label}</span>
              </NextLink>
            ))}
          </div>
        </div>
      </div>

      <div className="dcf-bar dcf-rise" style={{ '--d': '120ms' } as React.CSSProperties}>
        <p className="dcf-copy">© 2026 Lexiva Intelligence Space</p>
        <p className="dcf-status">
          <span className="dcf-dot" aria-hidden="true" />
          Local-only conversations · No provider connected
        </p>
        <button type="button" className="dcf-totop" onClick={toTop}>
          <span>Back to top</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M12 20 C11 14 12.5 9 12 4 M6 10 C8 8 10 6 12 4 C14 6 16 8 18.5 9.5" />
          </svg>
        </button>
      </div>
    </footer>
  );
}

const CSS =
  '.dcf{position:relative;isolation:isolate;overflow:hidden;width:100%;box-sizing:border-box;display:flex;flex-direction:column;background:var(--dcf-bg);color:var(--dcf-ink);border-top:1px solid rgba(255,255,255,.08);--dcf-soft:color-mix(in oklab,var(--dcf-ink) 62%,var(--dcf-bg));--dcf-line:color-mix(in oklab,var(--dcf-ink) 16%,var(--dcf-bg));--dcf-pad:clamp(16px,4vw,56px)}' +
  '.dcf *,.dcf *::before,.dcf *::after{box-sizing:border-box}' +
  '.dcf a{color:inherit;text-decoration:none}' +
  '.dcf button{appearance:none;background:none;border:0;padding:0;margin:0;font:inherit;color:inherit;cursor:pointer}' +
  '.dcf h2,.dcf h3,.dcf p,.dcf ul{margin:0;padding:0}.dcf ul{list-style:none}' +
  '.dcf svg{max-width:none;overflow:visible}' +
  '.dcf :focus-visible{outline:2px dashed var(--dcf-ink);outline-offset:4px;border-radius:6px}' +
  '.dcf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
  '.dcf-top{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,2fr);grid-template-rows:auto 1fr;column-gap:clamp(24px,5vw,80px);row-gap:14px;padding:clamp(28px,4.5vw,56px) var(--dcf-pad) 0;max-width:1360px;width:100%;margin:0 auto;position:relative;z-index:3}' +
  '.dcf-brand{display:flex;align-items:center;gap:10px;grid-column:1;grid-row:1}' +
  '.dcf-logo{display:grid;place-items:center;width:40px;height:40px;border-radius:999px;border:2px solid var(--dcf-ink);background:var(--dcf-bg);transform:rotate(-6deg)}' +
  '.dcf-brandname{font-weight:800;font-size:19px;letter-spacing:-.02em}' +
  '.dcf-blurb{grid-column:1;grid-row:2;font-size:15px;line-height:1.55;color:var(--dcf-soft);max-width:34ch}' +
  '.dcf-cols{grid-column:2;grid-row:1/span 2;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}' +
  '.dcf-coltitle{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;color:var(--dcf-accent)}' +
  '.dcf-col li{margin:0 0 7px}' +
  '.dcf-link{position:relative;display:inline-block;font-size:14px;font-weight:550;color:var(--dcf-soft);padding:2px 0;transition:color .2s}' +
  '.dcf-link:hover{color:var(--dcf-ink)}.dcf-link.is-static{cursor:default}.dcf-link.is-static:hover{color:var(--dcf-soft)}' +
  '.dcf-squiggle{position:absolute;left:-2px;right:-2px;bottom:-4px;width:calc(100% + 4px);height:7px;pointer-events:none}' +
  '.dcf-squiggle path{fill:none;stroke:var(--dcf-accent);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .35s cubic-bezier(.4,0,.2,1)}' +
  '.dcf-link:hover .dcf-squiggle path,.dcf-link:focus-visible .dcf-squiggle path{stroke-dashoffset:0}' +
  '.dcf-world{position:relative;flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(22px,4vw,48px) var(--dcf-pad) 0;max-width:1360px;width:100%;margin:0 auto}' +
  '.dcf-stage{position:relative;z-index:1}' +
  '.dcf-svg{display:block;width:100%;height:auto;user-select:none;-webkit-user-select:none}' +
  '.dcf-svg text{fill:var(--dcf-ink)}' +
  '.dcf-art{fill:var(--dcf-bg);stroke:var(--dcf-ink);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}' +
  '.dcf-art .n{fill:none}.dcf-art .k{fill:var(--dcf-ink)}.dcf-art .a{fill:var(--dcf-accent)}.dcf-art .o{fill:#ff9f1c}.dcf-art .r{fill:#ff4d4d}' +
  '.dcf-art .thin{stroke-width:1.5}.dcf-art .thick{stroke-width:3.4}' +
  '.dcf-art .dcf-glint{fill:var(--dcf-bg);stroke:none}' +
  '.dcf-art .dcf-shadow{fill:var(--dcf-ink);stroke:none;opacity:.14}' +
  '.dcf-ground path{fill:none;stroke:var(--dcf-ink);stroke-width:2.4;stroke-linecap:round}' +
  '.dcf-ground .dcf-tufts{stroke-width:1.8}' +
  '.dcf-pebble{fill:var(--dcf-bg);stroke:var(--dcf-ink);stroke-width:1.6}' +
  '.dcf-dust{fill:none;stroke:var(--dcf-ink);stroke-width:3;stroke-linecap:round;opacity:0}' +
  '.dcf-hit{fill:transparent;stroke:none;cursor:pointer;outline:none}' +
  '.dcf-hit:focus-visible{stroke:var(--dcf-ink);stroke-width:2.5;stroke-dasharray:6 6}' +
  '.dcf-glyph{transform-box:fill-box;transform-origin:50% 100%}' +
  '.dcf-glyph:hover{animation:dcf-jiggle .6s cubic-bezier(.3,1.5,.5,1)}' +
  '.dcf-art.dcf-bob{animation:dcf-bob 3.2s ease-in-out infinite}' +
  '.dcf-art.dcf-sway{transform-box:fill-box;transform-origin:50% 100%;animation:dcf-swing 4s ease-in-out infinite}' +
  '.dcf-art.dcf-peck{transform-box:fill-box;transform-origin:50% 100%;animation:dcf-peck 5.5s ease-in-out infinite}' +
  '.dcf-tail{transform-box:fill-box;transform-origin:0% 100%;animation:dcf-tail 2.8s ease-in-out infinite}' +
  '.dcf-hopper{transform-box:fill-box;transform-origin:50% 100%}' +
  '.dcf-hopper.is-hop{animation:dcf-hop .62s cubic-bezier(.3,.7,.4,1)}' +
  '.dcf-arrive{transform-box:fill-box;transform-origin:50% 100%}' +
  '.dcf-bubbles{position:absolute;inset:0;pointer-events:none;z-index:2}' +
  '.dcf-bubble{position:absolute;transform:translate(-50%,-100%) rotate(-2deg);transform-origin:50% 100%;background:var(--dcf-bg);color:var(--dcf-ink);border:2px solid var(--dcf-ink);border-radius:16px;padding:7px 12px;font-size:13px;font-weight:700;line-height:1.25;white-space:nowrap;box-shadow:3px 3px 0 var(--dcf-accent);animation:dcf-bubble .32s cubic-bezier(.3,1.6,.5,1) both;margin-top:-4px}' +
  ".dcf-bubble::after{content:'';position:absolute;left:50%;bottom:-9px;width:14px;height:14px;background:var(--dcf-bg);border-right:2px solid var(--dcf-ink);border-bottom:2px solid var(--dcf-ink);transform:translateX(-50%) rotate(45deg)}" +
  '.dcf-bubble.is-left{transform:translate(-88%,-100%) rotate(2deg);transform-origin:88% 100%}.dcf-bubble.is-left::after{left:88%}' +
  '.dcf-doodles{position:absolute;inset:0;pointer-events:none;z-index:2;overflow:hidden}' +
  '.dcf-doodle{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;will-change:transform;touch-action:manipulation}' +
  '.dcf-doodle-in{display:block;width:100%;height:100%}' +
  '.dcf-doodle svg,.dcf-icon{display:block;stroke:var(--dcf-ink);stroke-width:1.9;stroke-linejoin:round;stroke-linecap:round}' +
  '.dcf-doodle svg{width:100%;height:100%}' +
  '.dcf-paperfill{fill:var(--dcf-bg)}' +
  '.dcf-cta{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;gap:20px;padding:clamp(20px,3vw,34px) 0 clamp(30px,4vw,48px);text-align:center}' +
  '.dcf-tagline{font-size:clamp(17px,1.9vw,22px);line-height:1.4;letter-spacing:-.005em;max-width:44ch;text-wrap:balance}' +
  '.dcf-word{display:inline-block;white-space:pre}' +
  '.dcf-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}' +
  '.dcf-btn{display:inline-flex;align-items:center;gap:8px;height:46px;padding:0 20px 0 16px;border-radius:999px;border:2px solid var(--dcf-ink);font-size:14.5px;font-weight:750;letter-spacing:-.01em;box-shadow:0 3px 0 var(--dcf-ink);transition:transform .18s cubic-bezier(.3,1.4,.5,1),box-shadow .18s cubic-bezier(.3,1.4,.5,1)}' +
  '.dcf-btn.is-outline{background:var(--dcf-bg);color:var(--dcf-ink)}' +
  '.dcf-btn.is-solid{background:var(--dcf-ink);color:var(--dcf-bg);box-shadow:0 3px 0 var(--dcf-accent)}' +
  '.dcf-btn.is-solid .dcf-icon{stroke:var(--dcf-bg)}' +
  '.dcf-btn:hover{transform:translateY(-2px) rotate(-1.2deg);box-shadow:0 5px 0 var(--dcf-ink)}' +
  '.dcf-btn.is-solid:hover{box-shadow:0 5px 0 var(--dcf-accent)}' +
  '.dcf-btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--dcf-ink);transition-duration:.06s}' +
  '.dcf-btn:hover .dcf-icon{animation:dcf-wiggle .5s ease-in-out}' +
  '.dcf-bar{position:relative;z-index:3;display:flex;flex-wrap:wrap;align-items:center;gap:10px 26px;padding:18px var(--dcf-pad) 22px;max-width:1360px;width:100%;margin:0 auto;border-top:1.5px dashed var(--dcf-line);font-size:13px}' +
  '.dcf-copy{color:var(--dcf-soft);margin-right:auto}' +
  '.dcf-status{display:flex;align-items:center;gap:8px;color:var(--dcf-soft)}' +
  '.dcf-dot{width:8px;height:8px;border-radius:99px;background:#34d399}' +
  '.dcf-totop{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;padding:6px 12px;border-radius:999px;border:1.5px solid var(--dcf-ink);transition:transform .2s cubic-bezier(.3,1.5,.5,1)}' +
  '.dcf-totop svg{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}' +
  '.dcf-totop:hover{transform:translateY(-2px)}' +
  ".dcf[data-play='0'] .dcf-letter,.dcf[data-play='0'] .dcf-arrive,.dcf[data-play='0'] .dcf-word,.dcf[data-play='0'] .dcf-pop,.dcf[data-play='0'] .dcf-rise,.dcf[data-play='0'] .dcf-fade,.dcf[data-play='0'] .dcf-doodle-in{opacity:0}" +
  ".dcf[data-play='0'] .dcf-draw{stroke-dasharray:1;stroke-dashoffset:1}" +
  '.dcf-letter{transform-box:fill-box;transform-origin:50% 100%}' +
  ".dcf[data-play='1'] .dcf-letter{animation:dcf-stamp .62s cubic-bezier(.2,.8,.25,1.15) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-dust{animation:dcf-dust .5s ease-out calc(var(--d) + .22s) both}" +
  ".dcf[data-play='1'] .dcf-draw{stroke-dasharray:1;animation:dcf-draw 1.1s cubic-bezier(.6,0,.3,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-fade{animation:dcf-fade .6s ease-out var(--d) both}" +
  ".dcf[data-play='1'] .dcf-arrive-front{animation:dcf-rise-up .75s cubic-bezier(.3,1.5,.5,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-arrive-top{animation:dcf-plop .8s cubic-bezier(.3,.9,.4,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-arrive-behind{animation:dcf-peek .9s cubic-bezier(.3,1.4,.5,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-word{animation:dcf-word .6s cubic-bezier(.2,.8,.3,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-pop{animation:dcf-popin .55s cubic-bezier(.3,1.6,.5,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-rise{animation:dcf-fadeup .7s cubic-bezier(.2,.8,.3,1) var(--d) both}" +
  ".dcf[data-play='1'] .dcf-doodle-in{animation:dcf-fade .6s ease-out var(--d) both}" +
  '@keyframes dcf-stamp{0%{opacity:0;transform:translateY(-34%) scale(1.28) rotate(var(--r))}55%{opacity:1;transform:translateY(2%) scale(.95,1.05) rotate(0deg)}75%{transform:translateY(0) scale(1.04,.95)}100%{opacity:1;transform:none}}' +
  '@keyframes dcf-dust{0%{opacity:0;stroke-dasharray:0 40}30%{opacity:.9}100%{opacity:0;stroke-dasharray:14 40;stroke-dashoffset:-16}}' +
  '@keyframes dcf-draw{to{stroke-dashoffset:0}}' +
  '@keyframes dcf-fade{from{opacity:0}to{opacity:1}}' +
  '@keyframes dcf-rise-up{0%{opacity:0;transform:translateY(30%) scale(.7,.3)}45%{opacity:1;transform:translateY(-8%) scale(.92,1.12)}70%{transform:translateY(0) scale(1.08,.92)}100%{opacity:1;transform:none}}' +
  '@keyframes dcf-plop{0%{opacity:0;transform:translateY(-90%)}50%{opacity:1;transform:translateY(0) scale(1.1,.86)}68%{transform:translateY(-10%) scale(.96,1.04)}84%{transform:translateY(0) scale(1.03,.97)}100%{opacity:1;transform:none}}' +
  '@keyframes dcf-peek{0%{opacity:0;transform:translateY(55%)}60%{opacity:1;transform:translateY(-6%)}100%{opacity:1;transform:none}}' +
  '@keyframes dcf-word{from{opacity:0;transform:translateY(.6em) rotate(3deg)}to{opacity:1;transform:none}}' +
  '@keyframes dcf-popin{0%{opacity:0;transform:translateY(10px) scale(.6) rotate(-4deg)}100%{opacity:1;transform:none}}' +
  '@keyframes dcf-fadeup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}' +
  '@keyframes dcf-jiggle{0%{transform:none}25%{transform:rotate(-4deg) scale(1.03,.97)}50%{transform:rotate(3deg) translateY(-3%)}75%{transform:rotate(-1.5deg)}100%{transform:none}}' +
  '@keyframes dcf-hop{0%{transform:none}18%{transform:scale(1.12,.84)}45%{transform:translateY(-28%) scale(.94,1.08)}72%{transform:translateY(0) scale(1.1,.88)}86%{transform:scale(.97,1.03)}100%{transform:none}}' +
  '@keyframes dcf-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}' +
  '@keyframes dcf-swing{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2.5deg)}}' +
  '@keyframes dcf-peck{0%,62%,100%{transform:none}66%{transform:rotate(14deg) translateY(2px)}70%{transform:none}74%{transform:rotate(12deg) translateY(2px)}78%{transform:none}}' +
  '@keyframes dcf-tail{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-12deg)}}' +
  '@keyframes dcf-bubble{from{opacity:0;scale:.6}to{opacity:1;scale:1}}' +
  '@keyframes dcf-wiggle{0%,100%{transform:none}30%{transform:rotate(-14deg) scale(1.15)}60%{transform:rotate(10deg)}}' +
  '@media (max-width:860px){.dcf-top{grid-template-columns:1fr;grid-template-rows:auto}.dcf-brand,.dcf-blurb,.dcf-cols{grid-column:1;grid-row:auto}.dcf-cols{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:14px;row-gap:22px}.dcf-copy{width:100%;margin-right:0}}' +
  '@media (max-width:480px){.dcf-btn{height:42px;font-size:13.5px;padding:0 16px 0 13px}.dcf-bubble{font-size:12px;padding:6px 10px}.dcf-totop span{display:none}}' +
  '@media (prefers-reduced-motion:reduce){.dcf *,.dcf *::before,.dcf *::after{animation:none!important;transition:none!important}.dcf .dcf-letter,.dcf .dcf-arrive,.dcf .dcf-word,.dcf .dcf-pop,.dcf .dcf-rise,.dcf .dcf-fade,.dcf .dcf-doodle-in{opacity:1!important}.dcf .dcf-draw{stroke-dashoffset:0!important}.dcf .dcf-dust{opacity:0!important}}';