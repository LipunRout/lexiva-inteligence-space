'use client';

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Link from 'next/link';
import { ButtonProps, ButtonVariant } from '@/types';

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-white text-[#0E0D14] border-0 hover:bg-indigo-100 active:bg-indigo-200 disabled:opacity-35 disabled:cursor-not-allowed',
  secondary:
    'bg-white/[0.04] text-white border border-white/[0.2] hover:bg-white/[0.1] active:bg-white/[0.14] disabled:border-white/10 disabled:text-white/30 disabled:cursor-not-allowed',
  ghost:
    'min-h-[44px] px-[10px] py-0 text-white/65 bg-transparent border-0 rounded-[8px] hover:bg-white/[0.08] hover:text-white active:bg-white/[0.14] disabled:opacity-30 disabled:cursor-not-allowed',
  icon:
    'w-[44px] h-[44px] p-0 text-white bg-white/[0.04] border border-white/[0.15] rounded-[100px] hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed',
};

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300';

export function Button({
  variant = 'primary',
  children,
  className,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: variant === 'icon' ? 0.98 : 1 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      className={clsx(
        'inline-flex items-center justify-center text-[14px] font-medium leading-[36px] transition-all duration-300',
        focusRing,
        variant === 'ghost' || variant === 'icon'
          ? ''
          : 'min-h-[44px] rounded-[100px] px-6 py-2',
        buttonStyles[variant],
        className
      )}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}

interface ButtonLinkProps {
  variant?: Exclude<ButtonVariant, 'icon'>;
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
}

export function ButtonLink({
  variant = 'primary',
  children,
  href,
  className,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        'inline-flex min-h-[44px] items-center justify-center rounded-[100px] px-6 py-2 text-[14px] font-medium leading-[36px] transition-all duration-300',
        focusRing,
        buttonStyles[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}