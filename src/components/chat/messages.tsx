'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Message, ModelInfo } from './types';
import { getModel } from './data';
import { ProviderIcon } from './provider-icon';
import { ActionMenu } from './conversation-menu';

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ---------- tiny markdown + code highlighting (no libraries) ---------- */

const TOKEN =
  /(\/\/[^\n]*|#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|var|function|return|if|else|for|while|import|from|export|default|async|await|class|new|def|in|of|true|false|null|undefined|type|interface)\b|(\b\d+(?:\.\d+)?\b)/g;

function highlight(code: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const cls = m[1] ? 'text-white/40 italic' : m[2] ? 'text-[#9be7b6]' : m[3] ? 'text-[#c4a7ff]' : 'text-[#ffb86b]';
    out.push(
      <span key={k++} className={cls}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

function CodeBlock({ raw }: { raw: string }) {
  const [copied, setCopied] = useState(false);
  const nl = raw.indexOf('\n');
  const lang = nl > -1 ? raw.slice(0, nl).trim() : '';
  const code = (nl > -1 ? raw.slice(nl + 1) : raw).replace(/\n$/, '');

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-[#010512]">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-white/45">{lang || 'code'}</span>
        <button
          type="button"
          onClick={async () => {
            if (await copyText(code)) {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            }
          }}
          className="rounded-md px-2 py-1 text-[12px] font-medium text-white/65 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6F73F7]"
        >
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-white/85">
        <code>{highlight(code)}</code>
      </pre>
    </div>
  );
}

function inline(text: string, key: string): React.ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((p, i) => {
    if (p.length > 2 && p.startsWith('`') && p.endsWith('`'))
      return (
        <code key={key + i} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-[#c7c9ff]">
          {p.slice(1, -1)}
        </code>
      );
    if (p.length > 4 && p.startsWith('**') && p.endsWith('**'))
      return (
        <strong key={key + i} className="font-semibold text-white">
          {p.slice(2, -2)}
        </strong>
      );
    return p;
  });
}

function TextBlocks({ text }: { text: string }) {
  const lines = text.split('\n');
  const out: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  const isUl = (s: string) => /^\s*[-*]\s+/.test(s);
  const isOl = (s: string) => /^\s*\d+\.\s+/.test(s);
  const isH = (s: string) => /^#{1,3}\s+/.test(s);

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (isH(line)) {
      out.push(
        <p key={k++} className="pt-1 text-[17px] font-semibold tracking-tight text-white">
          {inline(line.replace(/^#{1,3}\s+/, ''), 'h' + k)}
        </p>
      );
      i++;
      continue;
    }
    if (isUl(line) || isOl(line)) {
      const ordered = isOl(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? isOl(lines[i]) : isUl(lines[i]))) {
        items.push(lines[i].replace(ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/, ''));
        i++;
      }
      const Tag = ordered ? 'ol' : 'ul';
      out.push(
        <Tag
          key={k++}
          className={`space-y-1.5 pl-5 marker:text-[#6F73F7] ${ordered ? 'list-decimal' : 'list-disc'}`}
        >
          {items.map((it, j) => (
            <li key={j}>{inline(it, 'l' + j)}</li>
          ))}
        </Tag>
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !isH(lines[i]) && !isUl(lines[i]) && !isOl(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    out.push(<p key={k++}>{inline(para.join(' '), 'p' + k)}</p>);
  }
  return <>{out}</>;
}

export function Markdown({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-[15.5px] leading-[1.7] text-white/80">
      {text.split('```').map((seg, i) =>
        i % 2 === 1 ? <CodeBlock key={i} raw={seg} /> : <TextBlocks key={i} text={seg} />
      )}
    </div>
  );
}

/* ---------- messages ---------- */

export function UserMessage({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex justify-end"
    >
      <div className="max-w-[88%] whitespace-pre-wrap break-words rounded-[20px] rounded-br-md border border-[#6F73F7]/30 bg-[#6F73F7]/[0.16] px-4 py-3 text-[15.5px] leading-[1.6] text-white sm:max-w-[75%]">
        {message.content}
      </div>
    </motion.div>
  );
}

function IconBtn({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6F73F7] ${
        pressed ? 'bg-[#6F73F7]/20 text-[#c7c9ff]' : 'text-white/55 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

const svg = { viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: 'h-4 w-4', 'aria-hidden': true };

export function AIMessage({
  message,
  model,
  canRegenerate,
  onRegenerate,
  onFeedback,
  onDelete,
}: {
  message: Message;
  model: ModelInfo;
  canRegenerate: boolean;
  onRegenerate: () => void;
  onFeedback: (v: 'up' | 'down') => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const sample = message.kind === 'sample';
  const notice = message.kind === 'notice';

  // Real model replies are attributed to the model; samples and notices are attributed to Lexiva.
  const title = sample || notice ? 'Lexiva' : model.name;
  const badge = sample
    ? 'Sample content · not model output'
    : notice
      ? 'Notice · not model output'
      : model.provider;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex gap-3"
    >
      <ProviderIcon model={model} size={30} />
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[14px] font-semibold text-white">{title}</span>
          {badge && (
            <span className="rounded-full border border-white/[0.14] px-2 py-0.5 text-[11px] text-white/60">
              {badge}
            </span>
          )}
          {message.fallbackFromModelId && (
            <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-2 py-0.5 text-[11px] text-amber-100/75">
              Auto-switched from {getModel(message.fallbackFromModelId).name}
            </span>
          )}
        </div>

        <Markdown text={message.content} />

        <div className="-ml-2 mt-2 flex items-center gap-0.5">
          <IconBtn
            label={copied ? 'Copied' : 'Copy reply'}
            onClick={async () => {
              if (await copyText(message.content)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              }
            }}
          >
            {copied ? (
              <svg {...svg}><path d="m4 10 4 4 8-8" /></svg>
            ) : (
              <svg {...svg}><rect x="7" y="7" width="9" height="9" rx="2" /><path d="M13 7V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v6.5A1.5 1.5 0 0 0 5 13h2" /></svg>
            )}
          </IconBtn>
          {canRegenerate && (
            <IconBtn label="Regenerate reply" onClick={onRegenerate}>
              <svg {...svg}><path d="M16 10a6 6 0 1 1-2-4.5M16 3v3.5h-3.5" /></svg>
            </IconBtn>
          )}
          <IconBtn label="Like" pressed={message.feedback === 'up'} onClick={() => onFeedback('up')}>
            <svg {...svg}><path d="M7 9v7H4V9h3Zm0 0 3-6a1.6 1.6 0 0 1 1.6 1.8L11.2 8H15a1.5 1.5 0 0 1 1.5 1.8l-1 5A1.5 1.5 0 0 1 14 16H7" /></svg>
          </IconBtn>
          <IconBtn label="Dislike" pressed={message.feedback === 'down'} onClick={() => onFeedback('down')}>
            <svg {...svg}><path d="M7 11V4H4v7h3Zm0 0 3 6a1.6 1.6 0 0 0 1.6-1.8L11.2 12H15a1.5 1.5 0 0 0 1.5-1.8l-1-5A1.5 1.5 0 0 0 14 4H7" /></svg>
          </IconBtn>
          <ActionMenu
            label="More options"
            items={[
              { label: 'Copy as text', onSelect: () => void copyText(message.content) },
              { label: 'Delete reply', danger: true, onSelect: onDelete },
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function TypingRow({ model }: { model: ModelInfo }) {
  return (
    <div className="flex gap-3" role="status" aria-label="Waiting for a reply">
      <ProviderIcon model={model} size={30} />
      <div className="flex items-center gap-1.5 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#6F73F7] motion-safe:animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}