'use client';

import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { EmptyState, PageIntro, PrototypeNotice } from '@/components/ui/product-ui';

export default function ChatPage() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = prompt.trim();
    if (!message) return;
    setMessages((current) => [...current, message]);
    setPrompt('');
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[1180px] px-4 py-10 sm:px-7 sm:py-14">
      <PageIntro
        eyebrow="Conversation workspace"
        title="Start with a question."
        description="A focused place to think with AI. Choose a connected model and keep its identity attached to every response."
      >
        <div className="mt-6 max-w-[720px]">
          <PrototypeNotice>
            <strong>Prototype mode:</strong> no AI providers are connected, so
            messages stay in this browser session and do not receive model-generated replies.
          </PrototypeNotice>
        </div>
      </PageIntro>

      <section className="overflow-hidden rounded-[22px] border border-[#E8E5EF] bg-white shadow-[0_12px_42px_rgba(41,38,58,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[#EEEAF4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-[14px] font-semibold text-[#29263A]">New conversation</p>
            <p className="mt-1 text-[12px] text-[#85838F]">Conversation is not saved</p>
          </div>
          <div className="flex min-h-10 items-center gap-2 rounded-xl border border-[#E8E5EF] bg-[#FAF9FC] px-3 text-[12px] text-[#777582]">
            <span className="h-2 w-2 rounded-full bg-[#D79B49]" />
            No model connected
          </div>
        </div>

        <div className="min-h-[250px] px-5 py-4 sm:px-8">
          {messages.length === 0 ? (
            <EmptyState
              symbol="✳"
              title="What would you like to explore?"
              description="Try a prompt below. It will appear here, but the prototype will not send it to an AI provider."
            />
          ) : (
            <div className="space-y-5 py-5">
              {messages.map((message, index) => (
                <div key={`${index}-${message}`} className="ml-auto max-w-[min(100%,620px)]">
                  <p className="mb-2 text-right text-[11px] font-medium uppercase tracking-wide text-[#85838F]">You</p>
                  <div className="rounded-2xl rounded-tr-md bg-[#F0EDFF] px-4 py-3 text-[14px] leading-6 text-[#29263A]">
                    {message}
                  </div>
                </div>
              ))}
              <div role="status" className="max-w-[620px] rounded-2xl border border-[#E8E5EF] bg-[#FAF9FC] px-4 py-3 text-[13px] leading-5 text-[#777582]">
                No response was generated. Connect a model provider to receive an AI answer.
              </div>
            </div>
          )}
        </div>

        <form onSubmit={submitPrompt} className="border-t border-[#EEEAF4] p-4 sm:p-5">
          <label htmlFor="chat-prompt" className="sr-only">Your message</label>
          <div className="flex flex-col gap-3 rounded-[16px] border border-[#E5E2EC] bg-white p-2 sm:flex-row sm:items-end">
            <textarea
              id="chat-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask a question or share an idea..."
              rows={2}
              className="min-h-[64px] flex-1 resize-y rounded-xl border-0 bg-transparent px-3 py-2 text-[14px] leading-6 text-[#29263A] outline-none placeholder:text-[#9A98A3] focus-visible:ring-2 focus-visible:ring-[#7468EB]"
            />
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#29263A] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#403B59] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to preview
              <span aria-hidden="true">↗</span>
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] text-[#9A98A3]">
            Prototype only · Your message is not sent to an AI service
          </p>
        </form>
      </section>

      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-[#777582]">
        <Link href="/models" className="underline decoration-[#D8D4EA] underline-offset-4 hover:text-[#6559DB]">View provider connection status</Link>
        <Link href="/history" className="underline decoration-[#D8D4EA] underline-offset-4 hover:text-[#6559DB]">Conversation history</Link>
      </div>
    </main>
  );
}
