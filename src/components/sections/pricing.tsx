'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { clsx } from 'clsx';

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    description: 'For individuals just getting started.',
    features: ['Unlimited tasks', 'Basic project views', 'Mobile apps'],
    highlighted: false,
    ctaLabel: 'Get started free',
    ctaHref: '/pricing/starter',
  },
  {
    name: 'Advanced',
    price: '$13',
    description: 'For growing teams that need more control.',
    features: ['Everything in Starter', 'Custom fields', 'Timeline view', 'Advanced reporting'],
    highlighted: true,
    ctaLabel: 'Start free trial',
    ctaHref: '/pricing/advanced',
  },
  {
    name: 'Enterprise',
    price: 'Contact',
    description: 'For organizations needing security and scale.',
    features: ['Everything in Advanced', 'SAML SSO', 'Data export', 'Priority support'],
    highlighted: false,
    ctaLabel: 'Contact sales',
    ctaHref: '/pricing/enterprise',
  },
];

export function Pricing() {
  const reduce = useReducedMotion();

  return (
    <section id="pricing" className="relative overflow-hidden border-t border-white/[0.08] bg-[#030303] px-4 py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(129,140,248,0.16),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
            Plans for every team
          </p>
          <h2 className="mb-4 text-[36px] font-medium leading-[1.05] tracking-[-0.05em] text-white sm:text-[48px] lg:text-[60px]">
            Simple, <span className="hero-gradient">transparent pricing</span>
          </h2>
          <p className="text-[17px] leading-[1.6] text-white/60">
            Choose the plan that fits your team. All plans include a free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              whileHover={reduce ? undefined : { y: -4 }}
              className={clsx(
                'relative flex h-full flex-col rounded-[24px] border p-6 backdrop-blur transition-shadow sm:p-8',
                tier.highlighted
                  ? 'border-indigo-300/40 bg-white/[0.06] shadow-[0_20px_60px_-12px_rgba(129,140,248,0.35)]'
                  : 'border-white/[0.1] bg-white/[0.03]'
              )}
            >
              {tier.highlighted && (
                <span className="mb-4 inline-flex w-fit items-center rounded-full bg-gradient-to-r from-indigo-400 to-rose-400 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0E0D14]">
                  Most popular
                </span>
              )}
              <h3 className="mb-2 text-[24px] font-semibold tracking-[-0.03em] text-white">
                {tier.name}
              </h3>
              <p className="mb-6 text-[15px] leading-[1.6] text-white/60">
                {tier.description}
              </p>
              <div className="mb-1 text-[60px] font-medium leading-none tracking-[-0.055em] text-white sm:text-[68px]">
                {tier.price === '$0' || tier.price === '$13' ? (
                  <span className={tier.highlighted ? 'hero-gradient' : ''}>{tier.price}</span>
                ) : (
                  tier.price
                )}
                <span className="ml-1 text-[14px] font-normal tracking-normal text-white/50 sm:text-[16px]">
                  {tier.price === '$0' ? '/mo' : '/mo per user'}
                </span>
              </div>

              <ul className="mb-8 mt-7 space-y-3 border-t border-white/[0.1] pt-6 text-[14px] leading-[21px] text-white/70">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-400/20 text-indigo-200">
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaHref}
                className={clsx(
                  'mt-auto inline-flex h-[52px] w-full items-center justify-center rounded-full text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300',
                  tier.highlighted
                    ? 'bg-white text-[#0E0D14] hover:bg-indigo-100'
                    : 'border border-white/[0.2] bg-white/[0.04] text-white hover:bg-white/[0.1]'
                )}
              >
                {tier.ctaLabel}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}