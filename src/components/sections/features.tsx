'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { useStaggerChildren } from '@/lib/animations';

const features = [
  {
    title: 'Task tracking',
    description: 'Keep every task in one place with clear ownership and due dates.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    title: 'Project timelines',
    description: 'Visualize work across timelines so nothing slips through the cracks.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7h16M4 12h10M4 17h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="18" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Team collaboration',
    description: 'Comment, assign, and update in real time with your whole team.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2 1-4.2A7.5 7.5 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 11.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Custom fields',
    description: 'Tailor your project with fields that match your workflow exactly.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="9" cy="7" r="2.5" fill="white" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="15" cy="17" r="2.5" fill="white" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

export function Features() {
  const { container } = useStaggerChildren(0.2);

  return (
    <section id="features" className="bg-[#F5F4F3] px-4 py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 text-center sm:mb-14">
          <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.12em] text-[#646F79]">
            Thoughtful by design
          </p>
          <h2 className="mb-4 text-[36px] font-light leading-[1.08] tracking-[-0.03em] text-[#0D0E10] sm:text-[44px] lg:text-[54px]">
            Everything teams need
          </h2>
          <p className="mx-auto max-w-[600px] text-[16px] leading-[28px] text-[#646F79]">
            Powerful features wrapped in a calm, neutral interface that helps you
            focus on the work that matters.
          </p>
        </div>

        <div
          ref={container}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {features.map((feature) => (
            <div key={feature.title} data-stagger-item className="h-full">
              <Card className="h-full transition-colors duration-200 hover:border-[#C1C1C1]">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F4F3] text-[#646F79] [&_svg]:h-5 [&_svg]:w-5">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-[20px] font-medium leading-[1.3] text-[#0D0E10]">
                  {feature.title}
                </h3>
                <p className="text-[16px] leading-[28px] text-[#646F79]">
                  {feature.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
