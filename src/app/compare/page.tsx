import Link from 'next/link';
import { CompareWorkspace } from '@/components/compare/compare-workspace';

export default function ComparePage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[1240px] px-4 pb-16 pt-10 sm:px-7 sm:pt-14">
      <header className="mb-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c5b9ff]">
            <span className="h-px w-7 bg-[#c5b9ff]/70" />
            Lexiva / Compare
          </p>
          <h1 className="max-w-[760px] text-[38px] font-medium leading-[0.98] tracking-[-0.06em] text-[#f4f1ea] sm:text-[58px]">
            One question.
            <br />
            <span className="text-white/45">Two ways to think.</span>
          </h1>
          <p className="mt-5 max-w-[590px] text-[15px] leading-7 text-white/55">
            Send one prompt to several configured models at once. Each response stays attributed to
            the provider and model that produced it.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#101014] p-5">
          <div
            aria-hidden="true"
            className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-[#b9acff]/15"
          />
          <div
            aria-hidden="true"
            className="absolute -right-1 -top-3 h-20 w-20 rounded-full border border-[#e9b58a]/20"
          />
          <p className="relative text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
            The comparison loop
          </p>
          <div className="relative mt-5 flex items-center gap-2 text-[11px] font-medium">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-white/75">
              One prompt
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-white/75">
              Two views
            </span>
          </div>
        </div>
      </header>

      <CompareWorkspace />

      <div className="mt-6 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
        <span className="text-[12px] text-white/40">Want to prepare for comparison?</span>
        <Link
          href="/models"
          className="text-[12px] font-medium text-[#c5b9ff] underline decoration-[#c5b9ff]/35 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c5b9ff] motion-reduce:transition-none"
        >
          Explore model setup
        </Link>
      </div>
    </main>
  );
}
