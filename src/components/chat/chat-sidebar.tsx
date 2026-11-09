'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { Conversation } from './types';
import { getModel, groupConversations } from './data';
import { ActionMenu } from './conversation-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  open: boolean;
  drawerOpen: boolean;
  onCloseDrawer: () => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  user?: { name?: string; email?: string | null; avatarUrl?: string | null } | null;
  userLoading?: boolean;
}

const NAV = [
  { label: 'Chats', href: null },
  { label: 'Explore Models', href: '/models' },
  { label: 'Compare Models', href: '/compare' },
  { label: 'History', href: '/history' },
];

function Item({
  c,
  active,
  onSelect,
  onRename,
  onDelete,
}: {
  c: Conversation;
  active: boolean;
  onSelect: () => void;
  onRename: (t: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(c.title);
  const model = getModel(c.modelId);

  function commit() {
    onRename(text);
    setEditing(false);
  }

  return (
    <li className={`group flex items-center rounded-2xl ${active ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]'}`}>
      {editing ? (
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') setEditing(false);
          }}
          aria-label="Conversation title"
          maxLength={80}
          className="m-1.5 h-9 min-w-0 flex-1 rounded-full border border-white/20 bg-[#121215] px-3 text-[16px] text-[#f4f4f6] outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={onSelect}
          aria-current={active ? 'true' : undefined}
          className="min-w-0 flex-1 rounded-2xl px-3 py-2.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
        >
          <span className="block truncate text-[14px] font-medium tracking-[-0.011em] text-[#f4f4f6]">{c.title}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-[#8e8d95]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: model.color }} />
            {model.name}
          </span>
        </button>
      )}
      {!editing && (
        <div className="pr-1 transition-opacity lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
          <ActionMenu
            label={`Actions for ${c.title}`}
            items={[
              { label: 'Rename', onSelect: () => { setText(c.title); setEditing(true); } },
              {
                label: 'Delete',
                danger: true,
                onSelect: () => {
                  if (window.confirm('Delete this conversation?')) onDelete();
                },
              },
            ]}
          />
        </div>
      )}
    </li>
  );
}

function Content({
  conversations,
  activeId,
  onSelect,
  onNew,
  onRename,
  onDelete,
  user,
  userLoading,
}: Omit<Props, 'open' | 'drawerOpen' | 'onCloseDrawer'>) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) => c.title.toLowerCase().includes(q) || c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [conversations, query]);

  const groups = useMemo(() => groupConversations(filtered), [filtered]);

  return (
    <div className="flex h-full w-[288px] flex-col bg-[#18181c]">
      <div className="px-4 pb-3 pt-4">
        <Link href="/" aria-label="Lexiva home" className="inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60">
          <Image src="/lexiva-mark.png" alt="" aria-hidden="true" width={840} height={768} className="h-8 w-8 object-contain" />
          <span className="flex flex-col">
            <span className="text-[16px] font-semibold leading-4 tracking-[-0.04em] text-[#f4f4f6]">Lexiva</span>
            <span className="text-[7px] font-semibold uppercase leading-3 tracking-[0.16em] text-[#8e8d95]">Intelligence Space</span>
          </span>
        </Link>
      </div>

      <div className="space-y-2.5 px-3">
        <button
          type="button"
          onClick={onNew}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#f4f4f6] text-[14.5px] font-semibold text-[#18181c] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          New chat
        </button>
        <div className="relative">
          <label htmlFor="chat-search" className="sr-only">Search conversations</label>
          <svg viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e8d95]" aria-hidden="true">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.7" />
            <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            id="chat-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="h-10 w-full rounded-full border border-white/[0.095] bg-[#26262c] pl-10 pr-3 text-[16px] text-[#f4f4f6] outline-none placeholder:text-[#8c8b93] focus:border-white/[0.2] lg:text-[14px]"
          />
        </div>
      </div>

      <nav aria-label="Workspace" className="mt-3 px-3">
        {NAV.map((n) =>
          n.href ? (
            <Link
              key={n.label}
              href={n.href}
              className="flex h-10 items-center rounded-full px-4 text-[14px] text-[#8e8d95] transition-colors hover:bg-white/[0.05] hover:text-[#f4f4f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
            >
              {n.label}
            </Link>
          ) : (
            <span key={n.label} aria-current="page" className="flex h-10 items-center rounded-full bg-white/[0.08] px-4 text-[14px] font-semibold text-[#f4f4f6]">
              {n.label}
            </span>
          )
        )}
      </nav>

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto px-3 pb-3 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]">
        {groups.length === 0 && (
          <p className="px-3 py-6 text-center text-[13px] text-[#6e6d76]">
            {query ? 'No conversations match your search.' : 'No conversations yet.'}
          </p>
        )}
        {groups.map((g) => (
          <section key={g.label} className="mt-3">
            <h3 className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6d76]">{g.label}</h3>
            <ul className="space-y-0.5">
              {g.items.map((c) => (
                <Item
                  key={c.id}
                  c={c}
                  active={c.id === activeId}
                  onSelect={() => onSelect(c.id)}
                  onRename={(t) => onRename(c.id, t)}
                  onDelete={() => onDelete(c.id)}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-white/[0.06] p-3">
        {userLoading ? (
          <>
            <span className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-white/10" aria-hidden="true" />
            <span className="min-w-0 flex-1 space-y-2" aria-label="Loading account">
              <span className="block h-3 w-20 animate-pulse rounded bg-white/10" />
              <span className="block h-2.5 w-28 animate-pulse rounded bg-white/[0.07]" />
            </span>
          </>
        ) : (
          <>
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/[0.095]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#26262c] text-[13px] font-bold text-[#f4f4f6] ring-1 ring-white/[0.095]" aria-hidden="true">
                {(user?.name || user?.email || 'G').charAt(0).toUpperCase()}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-[#f4f4f6]">{user?.name || user?.email || 'Guest'}</span>
              <span className="block truncate text-[11.5px] text-[#6e6d76]">{user?.email || 'Not signed in'}</span>
            </span>
            {user && (
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[#9e9da6] hover:bg-white/[0.07] hover:text-[#f4f4f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                >
                  Sign out
                </button>
              </form>
            )}
          </>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}

export function ChatSidebar(props: Props) {
  const { open, drawerOpen, onCloseDrawer, onSelect, onNew } = props;

  useEffect(() => {
    if (!drawerOpen) return;
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onCloseDrawer();
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [drawerOpen, onCloseDrawer]);

  return (
    <>
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            key="desktop"
            initial={{ width: 0 }}
            animate={{ width: 288 }}
            exit={{ width: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            aria-label="Conversations"
            className="hidden shrink-0 overflow-hidden border-r border-white/[0.06] lg:block"
          >
            <Content {...props} />
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 lg:hidden"
          >
            <button type="button" aria-label="Close conversations" onClick={onCloseDrawer} className="absolute inset-0 bg-black/60" />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              aria-label="Conversations"
              className="absolute inset-y-0 left-0 max-w-[88vw] overflow-hidden border-r border-white/[0.1] shadow-[20px_0_60px_-10px_rgba(0,0,0,0.8)]"
            >
              <Content
                {...props}
                onSelect={(id) => {
                  onSelect(id);
                  onCloseDrawer();
                }}
                onNew={() => {
                  onNew();
                  onCloseDrawer();
                }}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}