'use client';

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Link from 'next/link';
import { ButtonProps, ButtonVariant } from '@/types';

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0D0D0D] text-white border-0 hover:opacity-95 active:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed',
  secondary:
    'bg-transparent text-[#0D0E10] border border-[#0D0E10] hover:bg-black/5 active:bg-black/10 disabled:border-[#0D0E10]/30 disabled:text-[#0D0E10]/30 disabled:cursor-not-allowed',
  ghost:
    'min-h-[44px] px-[10px] py-0 text-[#646F79] bg-transparent border-0 rounded-[3px] hover:bg-[#646F79]/[0.08] active:bg-[#646F79]/[0.15] disabled:opacity-30 disabled:cursor-not-allowed',
  icon:
    'w-[44px] h-[44px] p-0 text-white bg-transparent border-0 rounded-[100px] hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed',
};

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
        'inline-flex items-center justify-center text-[14px] font-medium leading-[36px] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00B2FF]',
        variant === 'ghost' || variant === 'icon'
          ? ''
          : 'min-h-[44px] rounded-[100px] px-[24px] py-[8px]',
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
        'inline-flex min-h-[44px] items-center justify-center rounded-[100px] px-[24px] py-[8px] text-[14px] font-medium leading-[36px] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00B2FF]',
        buttonStyles[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}
