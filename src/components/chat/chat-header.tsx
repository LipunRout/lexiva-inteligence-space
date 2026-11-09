'use client';

import React from 'react';
import Link from 'next/link';
import type { ModelInfo } from './types';

const icon = { viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, className: 'h-[18px] w-[18px]', 'aria-hidden': true };

export function ChatHeader({
  title,
  model,
  sidebarOpen,
  onToggleSidebar,
  onOpenDrawer,
  onNewChat,
}: {
  title: string;
  model: ModelInfo;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenDrawer: () => void;
  onNewChat: () => void;
}) {
  const btn =
    'inline-flex h-10 w-10 items-center justify-center rounded-full text-[#9e9da6] transition-colors hover:bg-white/[0.07] hover:text-[#f4f4f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60';

  const suffix = model.status === 'unavailable' ? 'unavailable' : model.provider;

  return (
    <header className="flex h-14 shrink-0 items-center gap-1.5 bg-[#121215] px-2 sm:px-4">
      <button type="button" onClick={onOpenDrawer} aria-label="Open conversations" className={`${btn} lg:hidden`}>
        <svg {...icon}><path d="M3 5.5h14M3 10h14M3 14.5h9" /></svg>
      </button>
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        aria-expanded={sidebarOpen}
        className={`${btn} hidden lg:inline-flex`}
      >
        <svg {...icon}><rect x="3" y="4" width="14" height="12" rx="2.5" /><path d="M8 4v12" /></svg>
      </button>
      <Link href="/" aria-label="Lexiva home" className={btn}>
        <svg {...icon}><path d="M3.5 9.5 10 4l6.5 5.5M5 8.5V16h10V8.5" /></svg>
      </Link>

      <h2 className="min-w-0 flex-1 truncate px-1 text-[15px] font-semibold tracking-[-0.011em] text-[#f4f4f6]">{title}</h2>

      <span className="hidden max-w-[260px] items-center gap-2 rounded-full border border-white/[0.095] bg-[#26262c] px-3 py-1 text-[12.5px] text-[#8e8d95] sm:inline-flex">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: model.color }} />
        <span className="truncate">
          {model.name}
          {suffix ? ` · ${suffix}` : ''}
        </span>
      </span>

      <button type="button" onClick={onNewChat} aria-label="New chat" className={btn}>
        <svg {...icon}><path d="M10 4v12M4 10h12" /></svg>
      </button>
    </header>
  );
}