'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ModelSelector } from './model-selector';

export function MessageComposer({
  modelId,
  onModelChange,
  onSend,
  disabled,
}: {
  modelId: string;
  onModelChange: (id: string) => void;
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState('');
  const [note, setNote] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  }, [value]);

  useEffect(() => {
    if (!note) return;
    const t = window.setTimeout(() => setNote(false), 4000);
    return () => window.clearTimeout(t);
  }, [note]);

  function submit() {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  }

  const ready = !!value.trim() && !disabled;

  return (
    <div className="w-full">
      <div className="rounded-[24px] border border-white/[0.065] bg-[#18181c] px-[18px] pb-4 pt-5 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45),0_1px_0_0_rgba(255,255,255,0.05)_inset] transition-colors focus-within:border-white/[0.14]">
        <label htmlFor="chat-input" className="sr-only">Message</label>
        <textarea
          id="chat-input"
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask anything..."
          className="mb-4 max-h-[180px] min-h-[28px] w-full resize-none bg-transparent px-0.5 text-[16px] leading-6 tracking-[-0.011em] text-[#f4f4f6] outline-none placeholder:text-[#8c8b93]"
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {/* Expanding "Add files" pill (preview only) */}
            <button
              type="button"
              onClick={() => setNote(true)}
              aria-label="Add files (preview only)"
              className="group/add inline-flex h-[38px] w-[38px] shrink-0 items-center overflow-hidden rounded-full border border-white/[0.095] bg-[#26262c] px-[10px] text-[#f4f4f6] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset] transition-[width,background-color] duration-300 hover:w-[112px] hover:bg-[#2d2d34] focus-visible:w-[112px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
                <path d="M8 2.5V13.5M2.5 8H13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="ml-2 -translate-x-1.5 whitespace-nowrap text-[15px] font-medium opacity-0 transition-all duration-200 group-hover/add:translate-x-0 group-hover/add:opacity-100 group-focus-visible/add:translate-x-0 group-focus-visible/add:opacity-100">
                Add files
              </span>
            </button>

            <ModelSelector value={modelId} onChange={onModelChange} />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!ready}
            aria-label="Send message"
            className={`inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border transition-all active:scale-95 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${
              ready
                ? 'border-white/[0.16] bg-[#f4f4f6] text-[#18181c] hover:bg-white'
                : 'border-white/[0.08] bg-[#222227] text-[#7c7b84]'
            }`}
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M8 12.8V3.2M8 3.2L3.8 7.4M8 3.2L12.2 7.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <p role="status" className="mt-2 min-h-[16px] px-2 text-center text-[11.5px] leading-4 text-[#6e6d76]">
        {note
          ? 'Attachments are a UI preview only. Files are not read or uploaded.'
          : 'Prototype: no AI model is connected. Messages stay in this browser.'}
      </p>
    </div>
  );
}