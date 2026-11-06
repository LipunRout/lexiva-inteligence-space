'use client';

import React from 'react';

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function easeInOutCubic(t: number) {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return [0, 0, 0];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixHex(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const k = clamp(t, 0, 1);
  return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',') + ')';
}

function rgba(a: string, b: string, t: number, alpha: number) {
  return mixHex(a, b, t).replace('rgb(', 'rgba(').replace(')', ',' + alpha + ')');
}

function nextSeed(seed: number) {
  const s = Math.abs(Math.floor(seed)) || 1;
  const n = ((s * 48271 + 11) % 2147483647) % 100000;
  return n === s ? (n + 7919) % 100000 : n;
}

function headingOf(yaw: number) {
  const d = Math.round((yaw * 180) / Math.PI) % 360;
  return (d + 360) % 360;
}

type Cloud = { core: Float32Array; grain: Float32Array; spikes: Float32Array };
const CORE_N = 2800;
const GRAIN_N = 14000;
const SPIKE_N = 16;
const SPHERE_R = 0.3;

function buildCloud(seed: number, coreN: number, grainN: number, spikeN: number): Cloud {
  const rand = mulberry32(seed * 2654435761 + 1);
  const unit = (): [number, number, number] => {
    const z = rand() * 2 - 1;
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - z * z);
    return [r * Math.cos(a), r * Math.sin(a), z];
  };
  const cross = (a: number[], b: number[]): [number, number, number] => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const norm = (v: number[]): [number, number, number] => {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  const curves: number[][] = [];
  const loops = 3 + Math.floor(rand() * 2);
  const W = 0.092;
  for (let k = 0; k < loops; k++) {
    const n = unit();
    const u = norm(cross(n, Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]));
    const v = cross(n, u);
    const p = Array.from({ length: 8 }, () => rand() * Math.PI * 2);
    const R = 0.9 + rand() * 0.16;
    const pts: number[] = [];
    const RES = 220;
    for (let i = 0; i <= RES; i++) {
      const t = (i / RES) * Math.PI * 2;
      const r = R * (1 + 0.15 * Math.sin(2 * t + p[0]) + 0.07 * Math.sin(3 * t + p[1]) + 0.04 * Math.sin(5 * t + p[2]));
      const h = R * (0.24 * Math.sin(2 * t + p[3]) + 0.08 * Math.sin(3 * t + p[4]));
      const c = Math.cos(t) * r;
      const s = Math.sin(t) * r;
      const w = W * (0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(3 * t + p[5]), 1.5)) * (0.72 + 0.28 * Math.sin(7 * t + p[6]));
      pts.push(u[0] * c + v[0] * s + n[0] * h, u[1] * c + v[1] * s + n[1] * h, u[2] * c + v[2] * s + n[2] * h, Math.max(0.018, w));
    }
    curves.push(pts);
  }
  for (let b = 0; b < 3; b++) {
    const A = curves[Math.floor(rand() * loops)];
    const B = curves[Math.floor(rand() * loops)];
    const ia = Math.floor(rand() * (A.length / 4)) * 4;
    const ib = Math.floor(rand() * (B.length / 4)) * 4;
    const a = [A[ia], A[ia + 1], A[ia + 2]];
    const c = [B[ib], B[ib + 1], B[ib + 2]];
    const mid = norm([(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2]);
    const lift = 1.08 + rand() * 0.18;
    const m = [mid[0] * lift, mid[1] * lift, mid[2] * lift];
    const pts: number[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const q = 1 - t;
      pts.push(
        q * q * a[0] + 2 * q * t * m[0] + t * t * c[0],
        q * q * a[1] + 2 * q * t * m[1] + t * t * c[1],
        q * q * a[2] + 2 * q * t * m[2] + t * t * c[2],
        W * (0.16 + 0.42 * Math.sin(Math.PI * t))
      );
    }
    curves.push(pts);
  }
  const segs: { c: number[]; i: number; len: number }[] = [];
  let total = 0;
  for (const c of curves) {
    for (let i = 0; i + 4 < c.length; i += 4) {
      const len = Math.hypot(c[i + 4] - c[i], c[i + 5] - c[i + 1], c[i + 6] - c[i + 2]);
      segs.push({ c, i, len });
      total += len;
    }
  }
  const core = new Float32Array(coreN * 4);
  const tan = new Float32Array(coreN * 3);
  let si = 0;
  let acc = 0;
  for (let k = 0; k < coreN; k++) {
    const target = ((k + 0.5) / coreN) * total;
    while (si < segs.length - 1 && acc + segs[si].len < target) acc += segs[si++].len;
    const { c, i, len } = segs[si];
    const f = len ? clamp((target - acc) / len, 0, 1) : 0;
    for (let d = 0; d < 4; d++) core[k * 4 + d] = c[i + d] + (c[i + 4 + d] - c[i + d]) * f;
    tan.set(norm([c[i + 4] - c[i], c[i + 5] - c[i + 1], c[i + 6] - c[i + 2]]), k * 3);
  }
  const grain = new Float32Array(grainN * 3);
  for (let g = 0; g < grainN; g++) {
    const k = Math.floor(rand() * coreN);
    const T = [tan[k * 3], tan[k * 3 + 1], tan[k * 3 + 2]];
    const d = unit();
    const dot = d[0] * T[0] + d[1] * T[1] + d[2] * T[2];
    const o = norm([d[0] - dot * T[0], d[1] - dot * T[1], d[2] - dot * T[2]]);
    const w = core[k * 4 + 3];
    const dust = rand() < 0.05;
    const r = dust ? w * (1.3 + rand() * 1.6) : w * (0.35 + 0.82 * Math.sqrt(rand()));
    for (let a = 0; a < 3; a++) grain[g * 3 + a] = core[k * 4 + a] + o[a] * r;
  }
  const spikes = new Float32Array(spikeN * 6);
  for (let s = 0; s < spikeN; s++) {
    const k = Math.floor(rand() * coreN);
    const p = [core[k * 4], core[k * 4 + 1], core[k * 4 + 2]];
    const j = unit();
    const dir = norm([p[0] + j[0] * 0.45, p[1] + j[1] * 0.45, p[2] + j[2] * 0.45]);
    const len = 0.18 + rand() * 0.42;
    spikes.set([p[0], p[1], p[2], p[0] + dir[0] * len, p[1] + dir[1] * len, p[2] + dir[2] * len], s * 6);
  }
  return { core, grain, spikes };
}

function project(x: number, y: number, z: number, yaw: number, pitch: number, f: number): [number, number, number, number] {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;
  const s = f / (f - z2);
  return [x1 * s, y2 * s, z2, s];
}

type Props = {
  seed?: number;
  ink?: string;
  background?: string;
  label?: string;
  hint?: string;
  className?: string;
};

export function InkOrbitSculpture({
  seed: seedProp = 7,
  ink = '#dcd8ff',
  background = '#0B0B0E',
  label = 'LEXIVA · CONCEPT VISUAL',
  hint = 'Drag to rotate · Click to reshape',
  className = '',
}: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const headingRef = React.useRef<HTMLSpanElement | null>(null);
  const [seed, setSeed] = React.useState(seedProp);
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  const st = React.useRef({
    yaw: 0.6, pitch: 0.18, vyaw: 0, vpitch: 0,
    leanYaw: 0, leanPitch: 0, tLeanYaw: 0, tLeanPitch: 0,
    drag: false, lastX: 0, lastY: 0, downX: 0, downY: 0, lastT: 0,
    from: null as Cloud | null, to: null as Cloud | null,
    morphT: 1, ring: 0, dirty: true, visible: true, heading: -1,
    reduced: false, ink, bg: background,
  });
  st.current.reduced = reduced;
  st.current.ink = ink;
  st.current.bg = background;
  st.current.dirty = true;

  const seedRef = React.useRef(seed);
  seedRef.current = seed;
  const reforge = React.useCallback(() => {
    const n = nextSeed(seedRef.current);
    seedRef.current = n;
    setSeed(n);
  }, []);

  React.useEffect(() => {
    const s = st.current;
    const next = buildCloud(seed, CORE_N, GRAIN_N, SPIKE_N);
    const canMorph = !!s.to;
    s.from = canMorph ? s.to : null;
    s.to = next;
    s.morphT = canMorph && !s.reduced ? 0 : 1;
    if (canMorph && !s.reduced) s.ring = 1;
    s.dirty = true;
  }, [seed]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const lens = document.createElement('canvas');
    const lctx = lens.getContext('2d');
    const s = st.current;
    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      W = Math.max(1, Math.round(canvas.clientWidth * dpr));
      H = Math.max(1, Math.round(canvas.clientHeight * dpr));
      canvas.width = W;
      canvas.height = H;
      s.dirty = true;
    };
    resize();
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);
    const io =
      typeof IntersectionObserver === 'function'
        ? new IntersectionObserver((es) => {
            s.visible = es.some((e) => e.isIntersecting);
            s.dirty = true;
          })
        : null;
    io?.observe(canvas);

    const NB = 7;
    const px = new Float32Array(CORE_N + GRAIN_N);
    const py = new Float32Array(CORE_N + GRAIN_N);
    const pr = new Float32Array(CORE_N);
    const bin = new Uint8Array(CORE_N + GRAIN_N);
    let raf = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = s.lastT ? Math.min(0.05, (now - s.lastT) / 1000) : 0.016;
      s.lastT = now;
      const B = s.to;
      if (!s.visible || !B) return;
      if (!s.drag) {
        const target = s.reduced ? 0 : 0.16;
        s.vyaw += (target - s.vyaw) * Math.min(1, dt * 1.6);
        s.yaw += s.vyaw * dt;
        s.pitch += s.vpitch * dt;
        s.vpitch *= Math.pow(0.04, dt);
        s.pitch += (0.18 - s.pitch) * Math.min(1, dt * 0.9);
      }
      s.pitch = clamp(s.pitch, -0.95, 1.25);
      s.leanYaw += (s.tLeanYaw - s.leanYaw) * Math.min(1, dt * 3);
      s.leanPitch += (s.tLeanPitch - s.leanPitch) * Math.min(1, dt * 3);
      if (s.morphT < 1) s.morphT = Math.min(1, s.morphT + dt / 1.3);
      if (s.ring > 0) s.ring = Math.max(0, s.ring - dt / 1.1);
      const moving =
        !s.reduced || s.drag || Math.abs(s.vyaw) > 0.002 || Math.abs(s.vpitch) > 0.002 ||
        s.morphT < 1 || s.ring > 0 ||
        Math.abs(s.tLeanYaw - s.leanYaw) > 0.001 || Math.abs(s.tLeanPitch - s.leanPitch) > 0.001;
      if (!moving && !s.dirty) return;
      s.dirty = false;

      const yaw = s.yaw + s.leanYaw;
      const pitch = s.pitch + s.leanPitch;
      const hd = headingOf(yaw);
      if (hd !== s.heading && headingRef.current) {
        s.heading = hd;
        headingRef.current.textContent = 'N ' + String(hd).padStart(3, '0') + '°';
      }

      const inkC = s.ink;
      const bg = s.bg;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const scale = Math.min(W, H) * 0.34;
      const f = 3.4;
      const m = easeInOutCubic(s.morphT);
      const A = s.from && s.from.grain.length === B.grain.length ? s.from : null;
      const mixP = (arrB: Float32Array, arrA: Float32Array | undefined, i: number) =>
        arrA && m < 1 ? arrA[i] + (arrB[i] - arrA[i]) * m : arrB[i];

      const reach = scale * 1.38;
      const grad = (x1: number, y1: number, x2: number, y2: number) => {
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, mixHex(inkC, bg, 1));
        g.addColorStop(0.5, mixHex(inkC, bg, 0.7));
        g.addColorStop(1, mixHex(inkC, bg, 1));
        return g;
      };
      ctx.lineWidth = Math.max(1, dpr);
      ctx.strokeStyle = grad(cx, cy - reach, cx, cy + reach);
      ctx.beginPath(); ctx.moveTo(cx, cy - reach); ctx.lineTo(cx, cy + reach); ctx.stroke();
      ctx.strokeStyle = grad(cx - reach, cy, cx + reach, cy);
      ctx.beginPath(); ctx.moveTo(cx - reach, cy); ctx.lineTo(cx + reach, cy); ctx.stroke();

      if (s.ring > 0) {
        const k = 1 - s.ring;
        ctx.strokeStyle = rgba(inkC, bg, 0.2 + 0.7 * k, s.ring * 0.8);
        ctx.lineWidth = Math.max(1, dpr * (1 + 2 * s.ring));
        ctx.beginPath();
        ctx.arc(cx, cy, scale * (0.32 + k * 1.25), 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < CORE_N; i++) {
        const [x, y, z, sc] = project(
          mixP(B.core, A?.core, i * 4), mixP(B.core, A?.core, i * 4 + 1), mixP(B.core, A?.core, i * 4 + 2),
          yaw, pitch, f
        );
        px[i] = cx + x * scale;
        py[i] = cy + y * scale;
        pr[i] = mixP(B.core, A?.core, i * 4 + 3) * scale * sc * 0.78;
        bin[i] = clamp(Math.floor(((z + 1.25) / 2.5) * NB), 0, NB - 1);
      }
      for (let g = 0; g < GRAIN_N; g++) {
        const i = CORE_N + g;
        const [x, y, z] = project(
          mixP(B.grain, A?.grain, g * 3), mixP(B.grain, A?.grain, g * 3 + 1), mixP(B.grain, A?.grain, g * 3 + 2),
          yaw, pitch, f
        );
        px[i] = cx + x * scale;
        py[i] = cy + y * scale;
        bin[i] = clamp(Math.floor(((z + 1.25) / 2.5) * NB), 0, NB - 1);
      }
      const gs = Math.max(1, 1.15 * dpr);
      const pass = (b: number) => {
        const fade = 0.62 * (1 - b / (NB - 1));
        ctx.fillStyle = mixHex(inkC, bg, fade);
        ctx.beginPath();
        for (let i = 0; i < CORE_N; i++) {
          if (bin[i] !== b) continue;
          ctx.moveTo(px[i] + pr[i], py[i]);
          ctx.arc(px[i], py[i], pr[i], 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.fillStyle = mixHex(inkC, bg, Math.min(0.85, fade + 0.12));
        for (let i = CORE_N; i < CORE_N + GRAIN_N; i++) if (bin[i] === b) ctx.fillRect(px[i], py[i], gs, gs);
      };
      const spikes = (front: boolean) => {
        ctx.lineWidth = Math.max(0.75, 0.8 * dpr);
        for (let k = 0; k < SPIKE_N; k++) {
          const o = k * 6;
          const a = project(mixP(B.spikes, A?.spikes, o), mixP(B.spikes, A?.spikes, o + 1), mixP(B.spikes, A?.spikes, o + 2), yaw, pitch, f);
          const e = project(mixP(B.spikes, A?.spikes, o + 3), mixP(B.spikes, A?.spikes, o + 4), mixP(B.spikes, A?.spikes, o + 5), yaw, pitch, f);
          if (a[2] >= 0 !== front) continue;
          const g = ctx.createLinearGradient(cx + a[0] * scale, cy + a[1] * scale, cx + e[0] * scale, cy + e[1] * scale);
          g.addColorStop(0, mixHex(inkC, bg, front ? 0.1 : 0.5));
          g.addColorStop(1, mixHex(inkC, bg, 1));
          ctx.strokeStyle = g;
          ctx.beginPath();
          ctx.moveTo(cx + a[0] * scale, cy + a[1] * scale);
          ctx.lineTo(cx + e[0] * scale, cy + e[1] * scale);
          ctx.stroke();
        }
      };

      spikes(false);
      for (let b = 0; b < Math.floor(NB / 2) + 1; b++) pass(b);

      // glass sphere at the core
      const rs = SPHERE_R * scale;
      const span = rs * 3.1;
      if (lctx) {
        const ls = Math.max(1, Math.ceil(rs * 2));
        if (lens.width !== ls) { lens.width = ls; lens.height = ls; }
        lctx.setTransform(1, 0, 0, 1, 0, 0);
        lctx.fillStyle = bg;
        lctx.fillRect(0, 0, ls, ls);
        lctx.drawImage(canvas, cx - span, cy - span, span * 2, span * 2, 0, 0, ls, ls);
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rs, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = bg;
      ctx.fillRect(cx - rs, cy - rs, rs * 2, rs * 2);
      if (lctx) {
        ctx.translate(cx, cy);
        ctx.rotate(Math.PI + yaw * 0.15);
        ctx.globalAlpha = 0.85;
        ctx.drawImage(lens, -rs, -rs, rs * 2, rs * 2);
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      const rim = ctx.createRadialGradient(cx - rs * 0.25, cy - rs * 0.3, rs * 0.1, cx, cy, rs);
      rim.addColorStop(0, 'rgba(255,255,255,.35)');
      rim.addColorStop(0.55, 'rgba(255,255,255,.08)');
      rim.addColorStop(0.86, rgba(inkC, bg, 0.82, 0.2));
      rim.addColorStop(1, rgba(inkC, bg, 0.3, 0.6));
      ctx.fillStyle = rim;
      ctx.fillRect(cx - rs, cy - rs, rs * 2, rs * 2);
      const hl = ctx.createRadialGradient(cx - rs * 0.38, cy - rs * 0.42, 0, cx - rs * 0.38, cy - rs * 0.42, rs * 0.42);
      hl.addColorStop(0, 'rgba(255,255,255,.7)');
      hl.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hl;
      ctx.fillRect(cx - rs, cy - rs, rs * 2, rs * 2);
      ctx.restore();
      ctx.strokeStyle = mixHex(inkC, bg, 0.45);
      ctx.lineWidth = Math.max(1, dpr);
      ctx.beginPath();
      ctx.arc(cx, cy, rs, 0, Math.PI * 2);
      ctx.stroke();

      for (let b = Math.floor(NB / 2) + 1; b < NB; b++) pass(b);
      spikes(true);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
    };
  }, []);

  type PEv = React.PointerEvent<HTMLCanvasElement>;
  const onPointerDown = (e: PEv) => {
    const s = st.current;
    s.drag = true;
    s.lastX = s.downX = e.clientX;
    s.lastY = s.downY = e.clientY;
    s.vyaw = 0;
    s.vpitch = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PEv) => {
    const s = st.current;
    if (s.drag) {
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.yaw += dx * 0.01;
      s.pitch += dy * 0.008;
      s.vyaw = dx * 0.6;
      s.vpitch = dy * 0.45;
    } else if (e.pointerType === 'mouse') {
      const r = e.currentTarget.getBoundingClientRect();
      s.tLeanYaw = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
      s.tLeanPitch = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
    }
    s.dirty = true;
  };
  const onPointerUp = (e: PEv) => {
    const s = st.current;
    if (!s.drag) return;
    s.drag = false;
    s.vyaw = clamp(s.vyaw, -6, 6);
    s.vpitch = clamp(s.vpitch, -3, 3);
    if (Math.hypot(e.clientX - s.downX, e.clientY - s.downY) < 4) reforge();
  };
  const onLeave = () => {
    st.current.tLeanYaw = 0;
    st.current.tLeanPitch = 0;
  };
  const onKey = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const s = st.current;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      s.vyaw = e.key === 'ArrowLeft' ? -2.4 : 2.4;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      s.vpitch = e.key === 'ArrowUp' ? -1.6 : 1.6;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      reforge();
    } else return;
    s.dirty = true;
  };

  const faint = rgba(ink, background, 0.55, 1);
  return (
    <div
      className={'relative h-full w-full overflow-hidden ' + className}
      style={{
        background: 'radial-gradient(60% 55% at 50% 50%, ' + mixHex(ink, background, 0.94) + ', ' + background + ')',
        color: faint,
      }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        tabIndex={0}
        aria-label="Decorative ink sculpture. Drag or use the arrow keys to rotate; press Enter to reshape it."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onLeave}
        onKeyDown={onKey}
        className="absolute inset-0 block h-full w-full cursor-grab outline-none [touch-action:pan-y] active:cursor-grabbing focus-visible:shadow-[inset_0_0_0_2px_currentColor]"
      />
      <div className="pointer-events-none absolute inset-x-4 top-3 flex justify-between font-mono text-[10.5px] tracking-[0.04em]" aria-hidden="true">
        <span ref={headingRef}>N 000°</span>
        <span>{label}</span>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-3 flex justify-between font-mono text-[10.5px] tracking-[0.04em]" aria-hidden="true">
        <span>{hint}</span>
        <span>{'seed ' + String(seed).padStart(5, '0')}</span>
      </div>
    </div>
  );
}