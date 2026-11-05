import React from 'react';
import { Hero } from '@/components/sections/hero';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <main>
        <Hero />
        <section id="about" className="relative border-t border-white/[0.08] bg-[#030303] px-4 py-20 sm:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-500/[0.05] via-transparent to-rose-500/[0.05]"
          />
          <div className="relative mx-auto max-w-[1160px]">
            <div className="mx-auto mb-12 max-w-[620px] text-center">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
                Multiple perspectives, one place
              </p>
              <h2 className="text-[36px] font-medium leading-[1.08] tracking-[-0.05em] text-white sm:text-[48px]">
                Make more of every conversation.
              </h2>
              <p className="mt-4 text-[16px] leading-7 text-white/60">
                Explore different model perspectives without losing your
                context or your train of thought.
              </p>
            </div>
            <div id="workflow" className="grid gap-4 md:grid-cols-3">
              <WorkflowCard
                number="01"
                title="Choose a perspective"
                description="Bring supported AI models into one focused conversation space."
                tone="lavender"
              />
              <WorkflowCard
                number="02"
                title="Compare responses"
                description="See which model answered and understand different responses at a glance."
                tone="peach"
              />
              <WorkflowCard
                number="03"
                title="Keep your context"
                description="Return to conversations and continue exploring from where you left off."
                tone="mint"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function WorkflowCard({
  number,
  title,
  description,
  tone,
}: {
  number: string;
  title: string;
  description: string;
  tone: 'lavender' | 'peach' | 'mint';
}) {
  const toneStyles = {
    lavender: 'bg-indigo-400/15 text-indigo-200 ring-1 ring-indigo-300/20',
    peach: 'bg-rose-400/15 text-rose-200 ring-1 ring-rose-300/20',
    mint: 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/20',
  };

  return (
    <article className="rounded-[20px] border border-white/[0.1] bg-white/[0.03] p-6 backdrop-blur transition duration-200 hover:border-white/[0.2] hover:bg-white/[0.05] motion-reduce:transition-none sm:p-7">
      <span className={`mb-7 inline-flex h-11 w-11 items-center justify-center rounded-[14px] text-[12px] font-semibold ${toneStyles[tone]}`}>
        {number}
      </span>
      <h3 className="text-[19px] font-semibold tracking-[-0.03em] text-white">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-6 text-white/60">{description}</p>
    </article>
  );
}