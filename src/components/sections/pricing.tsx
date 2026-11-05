'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  return (
    <section id="pricing" className="bg-white px-4 py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 text-center sm:mb-14">
          <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.12em] text-[#646F79]">
            Plans for every team
          </p>
          <h2 className="mb-4 text-[36px] font-light leading-[1.08] tracking-[-0.03em] text-[#0D0E10] sm:text-[44px] lg:text-[54px]">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto max-w-[600px] text-[16px] leading-[28px] text-[#646F79]">
            Choose the plan that fits your team. All plans include a free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              whileHover={{ y: -3 }}
              className={clsx(
                'flex h-full flex-col rounded-[16px] border bg-white p-6 transition-shadow sm:p-8',
                tier.highlighted
                  ? 'border-[#00B2FF] shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
                  : 'border-[#DBDBDB]'
              )}
            >
              {tier.highlighted && (
                <Badge variant="default" className="mb-4 inline-flex">
                  Most popular
                </Badge>
              )}
              <h3 className="mb-2 text-[24px] font-medium leading-[1.2] text-[#0D0E10]">
                {tier.name}
              </h3>
              <p className="mb-6 text-[16px] leading-[28px] text-[#646F79]">
                {tier.description}
              </p>
              <div className="mb-1 text-[64px] font-light leading-[1] tracking-[-0.04em] text-[#0D0E10] sm:text-[72px]">
                {tier.price}
                <span className="ml-1 text-[14px] font-normal tracking-normal text-[#646F79] sm:text-[16px]">
                  {tier.price === '$0' ? '/mo' : '/mo per user'}
                </span>
              </div>
              <ul className="mb-8 mt-6 space-y-3 text-[14px] leading-[21px] text-[#646F79]">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#646F79]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonLink
                variant={tier.highlighted ? 'primary' : 'secondary'}
                href={tier.ctaHref}
                className="w-full"
              >
                {tier.ctaLabel}
              </ButtonLink>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
