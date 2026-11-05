'use client';

import React from 'react';
import clsx from 'clsx';
import { BadgeProps } from '@/types';

export function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-[#C8EBFC] text-[#00B2FF]',
    success: 'bg-[rgba(40,167,69,0.1)] text-[#28A745]',
    alert: 'bg-[rgba(240,106,106,0.1)] text-[#F06A6A]',
  };

  const base = clsx(
    'inline-flex items-center px-[12px] py-[4px] text-[12px] font-medium rounded-[4px]',
    variants[variant],
    className
  );

  return <span className={base}>{children}</span>;
}
