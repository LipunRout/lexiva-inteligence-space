'use client';

import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type Msg = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  link?: { label: string; href: string };
};

const SUGGESTIONS = [
  'What is Lexiva?',
  'Which models are available?',
  'What happens if a model fails?',
  'Are my chats saved?',
  'What files can I attach?',
  'Can I compare models?',
  'How does email sign-in work?',
  'Can I use voice input?',
];

const KB: { keys: string[]; text: string; link?: { label: string; href: string } }[] = [
  {
    keys: ['what is lexiva', 'about lexiva', 'what is this', 'what does lexiva do'],
    text: 'Lexiva is a multi-model AI chat workspace. Sign in, choose a model available to this deployment, and start a conversation. Chat replies come from the selected provider; model availability depends on the server configuration and each provider’s service.',
    link: { label: 'Open Lexiva Chat', href: '/chat' },
  },
  {
    keys: ['who are you', 'what are you', 'what is ask lexiva', 'are you ai', 'is this ai', 'live ai'],
    text: 'I’m Ask Lexiva, a curated product guide built into the homepage. I answer common questions about Lexiva; I’m not a live AI model and I don’t send your question to a provider.',
  },
  {
    keys: ['fallback', 'model fails', 'model error', 'provider error', 'auto-switch', 'auto switch', 'automatic switch', 'model switching', 'switching models'],
    text: 'If a model fails before it starts returning text, Lexiva can try up to two fallback models. It prefers a different provider, labels which model actually answered, and notes the switch. Once a response has started streaming, it does not switch mid-reply. A fallback can send the same prompt and attached text to another provider.',
    link: { label: 'Open the model directory', href: '/models' },
  },
  {
    keys: ['start chat', 'new chat', 'send a message', 'start a conversation', 'choose a model', 'select a model', 'switch models', 'change model', 'model selector'],
    text: 'Open Chat, choose an available model from the model selector, and send a message. Start a new conversation with New chat. The selected model is shown in the chat header and composer.',
    link: { label: 'Open Lexiva Chat', href: '/chat' },
  },
  {
    keys: ['english', 'language', 'arabic', 'hindi', 'spanish', 'reply in', 'respond in'],
    text: 'Chat requests instruct the selected or fallback model to answer in English. This is a prompt instruction rather than a strict language filter, so a model may occasionally ignore it.',
  },
  {
    keys: ['voice', 'microphone', 'speech', 'dictation', 'talk'],
    text: 'Signed-in users can use the microphone button to transcribe speech into the composer. Voice input requires browser microphone permission and a configured Groq API key; recordings are limited to about two minutes.',
    link: { label: 'Open Lexiva Chat', href: '/chat' },
  },
  {
    keys: ['error', 'not working', 'failed', 'unavailable', 'quota', 'rate limit'],
    text: 'Model access and quotas are controlled by each provider. Check the Models page to confirm a model is currently listed. If a chat model fails before producing text, Lexiva may try a fallback; if the request still fails, it reports an error instead of inventing a reply.',
    link: { label: 'Check the model directory', href: '/models' },
  },
  {
    keys: ['model', 'provider', 'available', 'gpt', 'claude', 'gemini', 'groq', 'nvidia', 'which ai'],
    text: 'The model directory lists models returned by providers configured on Lexiva’s server. Only listed models can be selected in Chat. Availability can vary with provider credentials, model access, service status, and usage limits.',
    link: { label: 'Explore available models', href: '/models' },
  },
  {
    keys: ['compare', 'comparison', 'side by side', 'side-by-side'],
    text: 'Lexiva has a server-side comparison endpoint, but the current Compare page is still a disabled preview and is not wired to run comparisons from its UI. It does not show fabricated answers.',
    link: { label: 'View Compare', href: '/compare' },
  },
  {
    keys: ['saved', 'save', 'history', 'persist', 'remember', 'stored', 'conversation history'],
    text: 'Signed-in conversations are saved to the account-backed chat history and can be reopened from the Chat sidebar. The separate History page is currently an informational preview.',
    link: { label: 'Open Chat and your conversations', href: '/chat' },
  },
  {
    keys: ['file', 'upload', 'attach', 'attachment', 'pdf', 'image', 'spreadsheet', 'document'],
    text: 'Chat currently accepts up to three plain-text or code files (for example TXT, Markdown, CSV, JSON, or source code). PDFs, images, and other binary files are not supported. Extracted text is sent as conversation context to the selected model, and may also be sent to a fallback provider if switching is needed.',
    link: { label: 'Open Chat', href: '/chat' },
  },
  {
    keys: ['sign in', 'sign-in', 'login', 'log in', 'otp', 'one-time code', 'verification code', 'six digit', '6 digit', 'email code'],
    text: 'Sign in with Google or GitHub, or request a six-digit email code through Supabase Auth. Email delivery depends on the SMTP provider configured for the deployment. Never share your one-time code.',
    link: { label: 'Go to sign in', href: '/login?next=%2Fchat' },
  },
  {
    keys: ['api key', 'secret', 'security', 'secure', 'privacy', 'third party', 'third-party', 'data sent'],
    text: 'Provider API keys are kept in server-side environment configuration and are not sent to the browser. Chat prompts and attached text are sent to the selected AI provider to generate a reply. If fallback is used, that same request may go to another configured provider.',
  },
  {
    keys: ['coming', 'roadmap', 'future', 'plan', 'agents', 'custom model', 'knowledge base'],
    text: 'Lexiva’s current focus is multi-model chat, model discovery, saved conversations, and provider fallback. The Compare page UI is still a preview. Custom models, knowledge sources, and AI agents are future ideas, not features to rely on today.',
  },
  {
    keys: ['hello', 'hi', 'hey', 'help'],
    text: 'Hi! I can explain Lexiva’s models, chat, fallback behavior, saved conversations, attachments, sign-in, privacy, and current limitations. Choose a suggestion or ask me about one of those topics.',
  },
];

const FALLBACK =
  'I’m a product guide for Lexiva, not a live general-purpose AI. I can answer questions about available models, chat, fallback, saved conversations, attachments, sign-in, privacy, and current limitations. Try one of the suggestions below.';

function reply(q: string): { text: string; link?: { label: string; href: string } } {
  const s = q.toLowerCase();
  const hit = KB
    .map((entry) => ({
      entry,
      specificity: Math.max(0, ...entry.keys.filter((key) => s.includes(key)).map((key) => key.length)),
    }))
    .filter(({ specificity }) => specificity > 0)
    .sort((a, b) => b.specificity - a.specificity)[0]?.entry;
  return hit ? { text: hit.text, link: hit.link } : { text: FALLBACK };
}

const GREETING: Msg = {
  id: 0,
  role: 'assistant',
  text: 'Hi, I’m Ask Lexiva—a quick guide to how this workspace works today. My answers are curated product information, not replies generated by a live AI model. What would you like to know?',
};

export function AskLexiva() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const idRef = useRef(1);
  const timer = useRef<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' });
  }, [messages, typing, reduce]);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 150);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || typing) return;
      const userMsg: Msg = { id: idRef.current++, role: 'user', text };
      setMessages((m) => [...m, userMsg]);
      setInput('');
      setTyping(true);
      const r = reply(text);
      timer.current = window.setTimeout(
        () => {
          setMessages((m) => [
            ...m,
            { id: idRef.current++, role: 'assistant', text: r.text, link: r.link },
          ]);
          setTyping(false);
        },
        reduce ? 0 : 550
      );
    },
    [typing, reduce]
  );

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    send(input);
  }

  function clearChat() {
    if (timer.current) window.clearTimeout(timer.current);
    setTyping(false);
    setMessages([GREETING]);
    inputRef.current?.focus();
  }

  return (
    <>
      {/* Launcher: always visible, no hover or scroll effects */}
            {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Ask Lexiva chat"
          aria-haspopup="dialog"
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.18] bg-[#0B0B0E] text-[15px] font-medium text-white shadow-[0_10px_40px_-10px_rgba(129,140,248,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 sm:bottom-6 sm:right-6 sm:w-auto sm:gap-3 sm:pl-3.5 sm:pr-5"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8">
            <Image
              src="/lexiva-mark.png"
              alt=""
              aria-hidden="true"
              width={512}
              height={512}
              className="h-full w-full object-contain"
            />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0B0B0E] bg-emerald-400" />
          </span>
          <span className="hidden sm:inline">Ask Lexiva</span>
        </button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ask Lexiva chat"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-x-2 bottom-2 z-50 flex h-[min(620px,calc(100svh-1rem))] flex-col overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#0B0B0E] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_60px_-20px_rgba(129,140,248,0.4)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]"
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-white/[0.08] px-4 py-3.5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/[0.14] via-transparent to-rose-500/[0.12]"
              />
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <Image
                  src="/lexiva-mark.png"
                  alt=""
                  aria-hidden="true"
                  width={512}
                  height={512}
                  className="h-full w-full object-contain"
                />
              </span>
              <div className="relative min-w-0 flex-1">
                <p className="text-[15px] font-semibold tracking-[-0.02em] text-white">Ask Lexiva</p>
                <p className="truncate text-[11.5px] text-white/50">Ask anything about Lexiva</p>
              </div>
              <button
                type="button"
                onClick={clearChat}
                aria-label="Clear conversation"
                title="Clear conversation"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path d="M4 10a6 6 0 1 0 2-4.5M4 3v3.5h3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              className="flex-1 space-y-4 overflow-y-auto px-4 py-5 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[86%] flex-col gap-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={
                        m.role === 'user'
                          ? 'rounded-[18px] rounded-br-[6px] bg-white px-4 py-2.5 text-[14.5px] leading-[1.5] text-[#0E0D14]'
                          : 'rounded-[18px] rounded-bl-[6px] border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-[14.5px] leading-[1.55] text-white/85'
                      }
                    >
                      {m.text}
                    </div>
                    {m.link && (
                      <Link
                        href={m.link.href}
                        onClick={close}
                        className="inline-flex items-center gap-1.5 rounded-full border border-indigo-300/30 bg-indigo-400/10 px-3 py-1.5 text-[12.5px] font-medium text-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
                      >
                        {m.link.label}
                        <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden="true">
                          <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <div className="flex justify-start" role="status" aria-label="Lexiva is typing">
                  <div className="flex items-center gap-1.5 rounded-[18px] rounded-bl-[6px] border border-white/[0.1] bg-white/[0.05] px-4 py-3.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-white/60 motion-safe:animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Suggestions */}
            <div className="border-t border-white/[0.06] px-3 pt-3">
              <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    disabled={typing}
                    className="shrink-0 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 text-[12.5px] font-medium text-white/75 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Composer */}
            <form onSubmit={onSubmit} className="flex items-center gap-2 px-3 pb-3">
              <label htmlFor="ask-lexiva-input" className="sr-only">
                Ask a question about Lexiva
              </label>
              <input
                id="ask-lexiva-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Lexiva..."
                autoComplete="off"
                maxLength={200}
                className="h-12 min-w-0 flex-1 rounded-full border border-white/[0.14] bg-white/[0.05] px-5 text-[14.5px] text-white outline-none placeholder:text-white/35 focus-visible:border-indigo-300 focus-visible:ring-2 focus-visible:ring-indigo-300/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#0E0D14] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M10 16V4m-5 5 5-5 5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}