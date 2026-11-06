'use client';

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { CardProps } from '@/types';

export function Card({
  variant = 'default',
  children,
  className,
  padding = 'md',
}: CardProps) {
  const paddingMap = {
    sm: 'p-5',
    md: 'p-6',
    lg: 'p-8',
  };

  const base = clsx(
    'rounded-[22px] border border-white/[0.1] bg-white/[0.03] text-white backdrop-blur transition-shadow duration-300 focus:outline-none',
    paddingMap[padding]
  );

  const variantClass =
    variant === 'elevated'
      ? 'bg-white/[0.05] shadow-[0_20px_50px_-20px_rgba(129,140,248,0.35)] hover:shadow-[0_24px_60px_-20px_rgba(129,140,248,0.5)]'
      : 'shadow-none';

  return (
    <motion.div
      whileHover={{ y: variant === 'elevated' ? -4 : 0 }}
      className={clsx(base, variantClass, className)}
    >
      {children}
    </motion.div>
  );
}