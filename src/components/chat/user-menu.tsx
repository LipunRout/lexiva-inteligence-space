'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useUser, type AppUser } from './use-user';

function Avatar({ user, size }: { user: AppUser; size: number }) {
  const [broken, setBroken] = useState(false);
  const initial = (user.name || user.email || '?').charAt(0).toUpperCase();

  if (user.avatarUrl && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center rounded-full bg-[#6F73F7] font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  );
}

export function UserMenu() {
  const { user, loading } = useUser();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', down);
    window.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', down);
      window.removeEventListener('keydown', key);
    };
  }, [open]);

  if (loading) return <span className="h-9 w-9 animate-pulse rounded-full bg-white/10" aria-hidden="true" />;

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center rounded-full border border-white/[0.1] bg-[#26262c] px-3 text-[13px] font-medium text-[#f4f4f6] hover:bg-[#2d2d34]"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.name}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-white/10 transition hover:ring-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
      >
        <Avatar user={user} size={34} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/[0.12] bg-[#1f1f25] p-2 shadow-[0_22px_48px_-10px_rgba(0,0,0,0.65)]"
        >
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar user={user} size={36} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium text-[#f4f4f6]">{user.name}</p>
              {user.email && <p className="truncate text-[12px] text-[#8e8d95]">{user.email}</p>}
            </div>
          </div>
          <div className="my-1 h-px bg-white/10" />
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              role="menuitem"
              className="flex h-10 w-full items-center gap-2 rounded-xl px-2 text-left text-[14px] text-[#f4f4f6] hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M8 4H5.5A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8M12.5 6.5 16 10l-3.5 3.5M16 10H8" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}