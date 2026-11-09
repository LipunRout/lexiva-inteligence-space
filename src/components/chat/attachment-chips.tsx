import React from 'react';
import type { Attachment } from './types';
import { formatSize } from './attachments';

export function AttachmentChips({ items }: { items: Attachment[] }) {
  return (
    <ul className="flex flex-wrap justify-end gap-1.5" aria-label="Attached files">
      {items.map((a, i) => (
        <li
          key={a.name + i}
          className="inline-flex max-w-[220px] items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] px-2.5 py-1 text-[12px] text-white/75"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
            <path d="M4 1.8h5l3 3v9.4H4V1.8Z M9 1.8v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
          <span className="truncate">{a.name}</span>
          <span className="shrink-0 text-white/40">{formatSize(a.size)}</span>
        </li>
      ))}
    </ul>
  );
}