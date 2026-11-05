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
    <div className="w-full space-y-[8px]">
      {label && (
        <label
          htmlFor={id}
          className="text-[14px] font-medium text-[#0D0E10] block"
        >
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
        className={clsx(
          'w-full h-[50px] px-[16px] py-[12px] text-[16px] font-light leading-[24px] rounded-[4px] text-[#23282F] transition-all duration-300 focus:outline-none placeholder:text-[#646F79] disabled:bg-[#F5F4F3] disabled:text-[#0D0D0D]/80 disabled:cursor-not-allowed',
          error
            ? 'border-[#F06A6A] text-[#F06A6A] focus:border-[#F06A6A] focus:shadow-[0_0_0_3px_rgba(240,106,106,0.1)]'
            : 'border-[#CFCFCF] bg-transparent focus:border-[#00B2FF] focus:shadow-[0_0_0_3px_rgba(0,178,255,0.1)]',
          className
        )}
      />
    </div>
  );
}
