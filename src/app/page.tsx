import React from 'react';
import { Hero } from '@/components/sections/hero';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#29263A]">
      <main>
        <Hero />
        <section id="about" className="border-t border-[#EEEAF4] bg-[#FAF9FC] px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-[1160px]">
            <div className="mx-auto mb-12 max-w-[620px] text-center">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7267D8]">
                Multiple perspectives, one place
              </p>
              <h2 className="text-[36px] font-medium leading-[1.08] tracking-[-0.05em] text-[#29263A] sm:text-[48px]">
                Make more of every conversation.
              </h2>
              <p className="mt-4 text-[16px] leading-7 text-[#777582]">
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
    lavender: 'bg-[#F0EDFF] text-[#6559DB]',
    peach: 'bg-[#FFF0E8] text-[#BB6747]',
    mint: 'bg-[#EAF5E0] text-[#558349]',
  };

  return (
    <article className="rounded-[20px] border border-[#E8E5EF] bg-white p-6 sm:p-7">
      <span className={`mb-7 inline-flex h-11 w-11 items-center justify-center rounded-[14px] text-[12px] font-semibold ${toneStyles[tone]}`}>
        {number}
      </span>
      <h3 className="text-[19px] font-semibold tracking-[-0.03em] text-[#29263A]">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-6 text-[#777582]">{description}</p>
    </article>
  );
}
