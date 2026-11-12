'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ModelSelector } from './model-selector';
import { ACCEPT, MAX_FILES, MAX_TOTAL_CHARS, formatSize, readFiles, type PickedFile } from './attachments';
import { useVoiceInput } from './use-voice-input';
import { requestStop } from './chat-events';
import { BorderBeam } from '@/components/ui/border-beam';
import { VoicePoweredOrb } from '@/components/ui/voice-powered-orb';

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export function MessageComposer({
  modelId,
  onModelChange,
  onSend,
  disabled,
  streaming,
}: {
  modelId: string;
  onModelChange: (id: string) => void;
  onSend: (text: string, files?: PickedFile[]) => void;
  /** While true (a reply is running) the send button turns into Stop. */
  disabled?: boolean;
  streaming?: boolean;
}) {
  const busyNow = streaming ?? !!disabled;
  const prefersReducedMotion = useReducedMotion();

  const [value, setValue] = useState('');
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);

  const voice = useVoiceInput((text) => {
    setValue((v) => (v.trim() ? v.replace(/\s+$/, '') + ' ' : '') + text);
    window.setTimeout(() => ref.current?.focus(), 0);
  });
  const recording = voice.state === 'recording';
  const transcribing = voice.state === 'transcribing';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  }, [value]);

  useEffect(() => {
    if (!note) return;
    const t = window.setTimeout(() => setNote(null), 6000);
    return () => window.clearTimeout(t);
  }, [note]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!picked.length) return;

    const room = MAX_FILES - files.length;
    if (room <= 0) {
      setNote(`You can attach up to ${MAX_FILES} files per message.`);
      return;
    }

    const { files: ok, errors } = await readFiles(picked.slice(0, room));
    const messages = [...errors];
    if (picked.length > room) messages.push(`Only ${MAX_FILES} files per message.`);

    let total = files.reduce((n, f) => n + f.text.length, 0);
    const accepted: PickedFile[] = [];
    for (const f of ok) {
      if (total + f.text.length > MAX_TOTAL_CHARS) {
        messages.push(`${f.name} would exceed the total size limit.`);
        continue;
      }
      total += f.text.length;
      accepted.push(f);
    }

    if (accepted.length) setFiles((cur) => [...cur, ...accepted]);
    if (messages.length) setNote(messages.join(' '));
  }

  function submit() {
    if ((!value.trim() && files.length === 0) || busyNow || voice.state !== 'idle') return;
    onSend(value, files);
    setValue('');
    setFiles([]);
  }

  const ready = (!!value.trim() || files.length > 0) && !busyNow && voice.state === 'idle';

  const circle =
    'inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border transition-all active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60';

  return (
    <div className="w-full">
      {/* In-flow orb: opens above the text box and pushes the page layout, nothing overlaps */}
      <AnimatePresence initial={false}>
        {recording && (
          <motion.div
            key="voice-orb"
            role="group"
            aria-label="Voice recording"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-center gap-2 pb-5 pt-2">
              <div className="h-40 w-40 sm:h-44 sm:w-44">
                <VoicePoweredOrb
                  audioLevel={voice.audioLevel}
                  reducedMotion={!!prefersReducedMotion}
                />
              </div>

              <div className="flex items-center gap-3 rounded-full border border-white/[0.1] bg-[#18181c]/90 py-1.5 pl-3.5 pr-1.5">
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-400" />
                <span aria-live="polite" className="text-[13px] text-[#f4f4f6]">
                  Listening · {mmss(voice.seconds)}
                </span>
                <button
                  type="button"
                  onClick={voice.cancel}
                  className="rounded-full border border-white/[0.12] px-3 py-1 text-[12px] text-[#c8c7ce] transition-colors hover:bg-white/[0.07] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={voice.stop}
                  className="rounded-full bg-[#f4f4f6] px-3 py-1 text-[12px] font-medium text-[#18181c] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                >
                  Finish
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BorderBeam
        size="md"
        colorVariant="colorful"
        strength={0.65}
        active={!prefersReducedMotion}
        className="w-full"
      >
        <div className="rounded-[24px] border border-white/[0.065] bg-[#18181c] px-[18px] pb-4 pt-5 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45),0_1px_0_0_rgba(255,255,255,0.05)_inset] transition-colors focus-within:border-white/[0.14]">
          {transcribing && (
            <div
              role="status"
              className="mb-3 flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-[13px] text-[#d8d7de]"
            >
              <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
              <span>Transcribing your recording...</span>
            </div>
          )}

          {files.length > 0 && (
            <ul className="mb-3 flex flex-wrap gap-1.5" aria-label="Files to send">
              {files.map((f, i) => (
                <li
                  key={f.name + i}
                  className="inline-flex max-w-[240px] items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] py-1 pl-2.5 pr-1 text-[12.5px] text-[#f4f4f6]"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 shrink-0 text-[#9e9da6]" aria-hidden="true">
                    <path d="M4 1.8h5l3 3v9.4H4V1.8Z M9 1.8v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                  <span className="truncate">{f.name}</span>
                  <span className="shrink-0 text-[#8e8d95]">{formatSize(f.size)}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((cur) => cur.filter((_, j) => j !== i))}
                    aria-label={`Remove ${f.name}`}
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#9e9da6] hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                  >
                    <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden="true">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <label htmlFor="chat-input" className="sr-only">Message</label>
          <textarea
            id="chat-input"
            ref={ref}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && busyNow) {
                requestStop();
                return;
              }
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={files.length ? 'Add a message about your files...' : 'Ask anything...'}
            className="mb-4 max-h-[180px] min-h-[28px] w-full resize-none bg-transparent px-0.5 text-[16px] leading-6 tracking-[-0.011em] text-[#f4f4f6] outline-none placeholder:text-[#8c8b93]"
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <input
                ref={picker}
                type="file"
                multiple
                accept={ACCEPT}
                onChange={onPick}
                className="hidden"
                aria-label="Choose files to attach"
                tabIndex={-1}
              />

              {/* Expanding "Add files" pill */}
              <button
                type="button"
                onClick={() => picker.current?.click()}
                disabled={busyNow}
                aria-label="Add files"
                className="group/add inline-flex h-[38px] w-[38px] shrink-0 items-center overflow-hidden rounded-full border border-white/[0.095] bg-[#26262c] px-[10px] text-[#f4f4f6] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset] transition-[width,background-color] duration-300 hover:w-[112px] hover:bg-[#2d2d34] focus-visible:w-[112px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 disabled:opacity-60"
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

            <div className="flex shrink-0 items-center gap-1.5">
              {voice.supported && !busyNow && (
                <button
                  type="button"
                  onClick={recording ? voice.stop : voice.start}
                  disabled={transcribing}
                  aria-label={recording ? 'Finish recording' : 'Dictate with your voice'}
                  title={recording ? 'Finish recording' : 'Dictate with your voice'}
                  className={`${circle} disabled:opacity-60 ${
                    recording
                      ? 'border-red-400/40 bg-red-500/20 text-red-100'
                      : 'border-white/[0.095] bg-[#26262c] text-[#f4f4f6] hover:bg-[#2d2d34]'
                  }`}
                >
                  {recording ? (
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                      <rect x="3.5" y="3.5" width="9" height="9" rx="2" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
                      <rect x="6" y="1.8" width="4" height="7.4" rx="2" />
                      <path d="M3.6 7.6a4.4 4.4 0 0 0 8.8 0M8 12v2.2" />
                    </svg>
                  )}
                </button>
              )}

              {busyNow ? (
                <button
                  type="button"
                  onClick={requestStop}
                  aria-label="Stop generating"
                  title="Stop generating (Esc)"
                  className={`${circle} border-white/[0.16] bg-[#f4f4f6] text-[#18181c] hover:bg-white`}
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                    <rect x="3.5" y="3.5" width="9" height="9" rx="2" fill="currentColor" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={!ready}
                  aria-label="Send message"
                  className={`${circle} disabled:cursor-not-allowed ${
                    ready
                      ? 'border-white/[0.16] bg-[#f4f4f6] text-[#18181c] hover:bg-white'
                      : 'border-white/[0.08] bg-[#222227] text-[#7c7b84]'
                  }`}
                >
                  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="M8 12.8V3.2M8 3.2L3.8 7.4M8 3.2L12.2 7.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </BorderBeam>

      <p role="status" className="mt-2 min-h-[16px] px-2 text-center text-[11.5px] leading-4 text-[#6e6d76]">
        {note ?? voice.error ?? 'Replies come from the model you select and can be wrong. Text and code files can be attached.'}
      </p>
    </div>
  );
}