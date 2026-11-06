'use client';

import React from 'react';
import { clsx } from 'clsx';
import { InputProps } from '@/types';

export function Input({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled,
  error,
  className,
}: InputProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={id} className="block text-[14px] font-medium text-white/85">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        className={clsx(
          'h-[50px] w-full rounded-[12px] border bg-white/[0.05] px-4 py-3 text-[16px] font-light leading-6 text-white transition-all duration-300 placeholder:text-white/35 focus:outline-none disabled:cursor-not-allowed disabled:bg-white/[0.03] disabled:text-white/40',
          error
            ? 'border-rose-400 text-rose-200 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.2)]'
            : 'border-white/[0.15] focus:border-indigo-300 focus:shadow-[0_0_0_3px_rgba(165,180,252,0.2)]',
          className
        )}
      />
    </div>
  );
}