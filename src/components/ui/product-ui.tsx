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
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7065D1]">
        {eyebrow}
      </p>
      <h1 className="text-[36px] font-semibold leading-[1.08] tracking-[-0.05em] text-[#29263A] sm:text-[48px]">
        {title}
      </h1>
      <p className="mt-4 max-w-[640px] text-[15px] leading-7 text-[#777582]">
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
      className="flex items-start gap-3 rounded-[14px] border border-[#E8E3D8] bg-[#FFFCF5] p-4 text-[13px] leading-5 text-[#6D624B]"
    >
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F6E9C9] text-[11px] font-semibold text-[#79652F]">
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
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#F0EDFF] text-[22px] font-medium text-[#6559DB]">
        {symbol}
      </span>
      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#29263A]">{title}</h2>
      <p className="mt-2 text-[14px] leading-6 text-[#777582]">{description}</p>
    </div>
  );
}
