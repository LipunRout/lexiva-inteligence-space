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
    sm: 'p-[24px]',
    md: 'p-[24px]',
    lg: 'p-[32px]',
  };

  const base = clsx(
    'border border-[#DBDBDB] rounded-[16px] bg-white text-[#0D0E10] transition-box-shadow duration-300 focus:outline-none',
    paddingMap[padding]
  );

  const variantClass =
    variant === 'elevated'
      ? 'shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]'
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
