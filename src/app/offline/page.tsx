import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'You’re offline · Lexiva',
  description: 'Lexiva is offline. Reconnect to continue using the workspace.',
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-[calc(100svh-52px)] items-center justify-center px-6 py-16">
      <section className="w-full max-w-[520px] rounded-[28px] border border-white/[0.12] bg-white/[0.04] p-8 text-center shadow-[0_24px_100px_rgba(70,50,160,0.12)] sm:p-12">
        <Image
          src="/lexiva-mark.png"
          alt=""
          aria-hidden="true"
          width={512}
          height={512}
          className="mx-auto mb-7 h-16 w-16 object-contain"
        />
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-300/[0.08] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-200">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
          Connection unavailable
        </p>
        <h1 className="text-[34px] font-medium leading-tight tracking-[-0.05em] text-white sm:text-[44px]">
          Lexiva is currently offline
        </h1>
        <p className="mx-auto mt-4 max-w-[390px] text-[15px] leading-6 text-white/60">
          This workspace needs an internet connection for full functionality. Once you’re back
          online, you can pick up where you left off.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-medium text-[#0E0D14] transition-colors hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
        >
          Try Again
        </Link>
      </section>
    </main>
  );
}
