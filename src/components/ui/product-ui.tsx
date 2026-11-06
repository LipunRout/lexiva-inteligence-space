import React from 'react';

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-9 max-w-[760px]">
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-300">
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-indigo-400 to-rose-400" />
        {eyebrow}
      </p>
      <h1 className="text-[34px] font-medium leading-[1.05] tracking-[-0.055em] text-white sm:text-[52px]">
        {title}
      </h1>
      <p className="mt-4 max-w-[640px] text-[16px] leading-[1.6] text-white/60">
        {description}
      </p>
      {children}
    </div>
  );
}

export function PrototypeNotice({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-[16px] border border-amber-300/20 bg-amber-300/[0.06] p-4 text-[13px] leading-5 text-amber-100/80"
    >
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-300/20 text-[11px] font-semibold text-amber-200">
        i
      </span>
      <div>{children}</div>
    </div>
  );
}

export function EmptyState({
  symbol,
  title,
  description,
}: {
  symbol: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-[440px] flex-col items-center py-14 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-indigo-400/25 to-rose-400/25 text-[22px] font-medium text-white ring-1 ring-white/[0.15]">
        {symbol}
      </span>
      <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-white">{title}</h2>
      <p className="mt-2 text-[14.5px] leading-6 text-white/55">{description}</p>
    </div>
  );
}