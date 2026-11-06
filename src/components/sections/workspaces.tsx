'use client';

import { useState } from 'react';
import Link from 'next/link';

const previews = [
  {
    id: 'conversation',
    label: 'Conversation',
    eyebrow: 'Chat workspace',
    title: 'A clear place to begin.',
    description:
      'The chat page is a local preview. Messages stay in this browser session and are not sent to an AI service.',
    status: 'No model connected',
    href: '/chat',
    linkLabel: 'Open chat preview',
  },
  {
    id: 'models',
    label: 'Models',
    eyebrow: 'Provider connections',
    title: 'See what is really available.',
    description:
      'There are no provider adapters or credentials configured in this project, so no models are listed as connected.',
    status: 'Setup required',
    href: '/models',
    linkLabel: 'View connection status',
  },
  {
    id: 'history',
    label: 'History',
    eyebrow: 'Conversation history',
    title: 'Designed to continue the thread.',
    description:
      'Conversation history is not persisted in the current prototype. This view explains the intended workspace direction.',
    status: 'Not persisted',
    href: '/history',
    linkLabel: 'View history preview',
  },
];

export function Workspaces() {
  const [activeId, setActiveId] = useState(previews[0].id);
  const activePreview =
    previews.find((preview) => preview.id === activeId) ?? previews[0];

  return (
    <section
      id="workspace"
      className="border-t border-white/[0.08] bg-[#08080B] px-4 py-20 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="mx-auto mb-9 max-w-[680px] text-center">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
            One considered workspace
          </p>
          <h2 className="text-[36px] font-medium leading-[1.08] tracking-[-0.05em] text-white sm:text-[50px]">
            Designed around the conversation.
          </h2>
          <p className="mx-auto mt-4 max-w-[540px] text-[15px] leading-7 text-white/55">
            Explore the current product previews and see what is—and is not—connected today.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Workspace previews"
          className="mb-5 flex flex-wrap justify-center gap-2"
        >
          {previews.map((preview) => {
            const selected = preview.id === activeId;
            return (
              <button
                key={preview.id}
                id={`${preview.id}-tab`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="workspace-preview-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(preview.id)}
                onKeyDown={(event) => {
                  const currentIndex = previews.findIndex(
                    (item) => item.id === activeId
                  );
                  let nextIndex: number | null = null;

                  if (event.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % previews.length;
                  } else if (event.key === 'ArrowLeft') {
                    nextIndex =
                      (currentIndex - 1 + previews.length) % previews.length;
                  } else if (event.key === 'Home') {
                    nextIndex = 0;
                  } else if (event.key === 'End') {
                    nextIndex = previews.length - 1;
                  }

                  if (nextIndex !== null) {
                    event.preventDefault();
                    const nextPreview = previews[nextIndex];
                    setActiveId(nextPreview.id);
                    document.getElementById(`${nextPreview.id}-tab`)?.focus();
                  }
                }}
                className={`min-h-11 rounded-full border px-5 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300 motion-reduce:transition-none ${
                  selected
                    ? 'border-white bg-white text-[#101014]'
                    : 'border-white/15 bg-white/[0.03] text-white/65 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {preview.label}
              </button>
            );
          })}
        </div>

        <div
          id="workspace-preview-panel"
          role="tabpanel"
          aria-labelledby={`${activePreview.id}-tab`}
          className="overflow-hidden rounded-[26px] border border-white/[0.12] bg-[#101014] shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)]"
        >
          <div className="flex min-h-14 items-center justify-between border-b border-white/[0.08] px-5 sm:px-7">
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-rose-300/70" />
              <span className="h-2 w-2 rounded-full bg-amber-200/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-200/70" />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
              Lexiva · {activePreview.eyebrow}
            </span>
            <span className="w-10" aria-hidden="true" />
          </div>

          <div className="grid min-h-[310px] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col justify-center border-b border-white/[0.08] px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r">
              <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/[0.06] px-3 py-1.5 text-[11px] font-medium text-amber-100/80">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-200" />
                {activePreview.status}
              </span>
              <h3 className="max-w-[400px] text-[28px] font-medium leading-[1.1] tracking-[-0.04em] text-white sm:text-[34px]">
                {activePreview.title}
              </h3>
              <p className="mt-4 max-w-[400px] text-[13px] leading-6 text-white/55">
                {activePreview.description}
              </p>
              <Link
                href={activePreview.href}
                className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 text-[12px] font-semibold text-[#101014] transition-colors hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 motion-reduce:transition-none"
              >
                {activePreview.linkLabel}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="flex items-center justify-center px-5 py-9 sm:px-10">
              <div className="w-full max-w-[440px] rounded-[20px] border border-white/[0.1] bg-[#0A0A0D] p-5 sm:p-7">
                <div className="mb-8 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-medium text-white/85">
                      {activePreview.label} preview
                    </p>
                    <p className="mt-1 text-[10px] text-white/40">
                      Prototype · not connected
                    </p>
                  </div>
                  <span className="rounded-full border border-white/[0.1] px-2.5 py-1 text-[10px] text-white/50">
                    Preview
                  </span>
                </div>
                <div className="flex min-h-[116px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.14] px-5 text-center">
                  <span
                    aria-hidden="true"
                    className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-300/10 text-[16px] text-indigo-200"
                  >
                    {activePreview.id === 'conversation'
                      ? '✳'
                      : activePreview.id === 'models'
                        ? '◇'
                        : '↺'}
                  </span>
                  <p className="text-[12px] font-medium text-white/80">
                    {activePreview.status}
                  </p>
                  <p className="mt-1 max-w-[260px] text-[10px] leading-5 text-white/40">
                    This visual is a product preview, not a live workspace.
                  </p>
                </div>
                <div
                  aria-hidden="true"
                  className="mt-4 flex h-10 items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-3"
                >
                  <span className="text-[10px] text-white/30">
                    No provider connected
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.08] text-[11px] text-white/40">
                    ↑
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
