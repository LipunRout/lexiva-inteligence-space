import Link from 'next/link';
import { EmptyState, PageIntro, PrototypeNotice } from '@/components/ui/product-ui';

export default function ComparePage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[1180px] px-4 py-10 sm:px-7 sm:py-14">
      <PageIntro
        eyebrow="Side-by-side thinking"
        title="Compare answers, not guesses."
        description="The comparison experience will show each response next to its verified provider and model, so differences are easy to understand."
      />

      <PrototypeNotice>
        <strong>Comparison is unavailable in this prototype.</strong> No model
        APIs are connected. This page intentionally shows no sample AI answers.
      </PrototypeNotice>

      <section className="mt-8 overflow-hidden rounded-[22px] border border-[#E8E5EF] bg-white shadow-[0_12px_42px_rgba(41,38,58,0.04)]">
        <div className="flex flex-col gap-3 border-b border-[#EEEAF4] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-[15px] font-semibold text-[#29263A]">Response comparison</h2>
            <p className="mt-1 text-[12px] text-[#85838F]">Provider names will appear after integrations are verified.</p>
          </div>
          <span className="inline-flex min-h-9 w-fit items-center gap-2 rounded-full bg-[#F5F2EA] px-3 text-[11px] font-medium text-[#79652F]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D79B49]" />
            Waiting for providers
          </span>
        </div>

        <div className="grid divide-y divide-[#EEEAF4] md:grid-cols-2 md:divide-x md:divide-y-0">
          {[1, 2].map((column) => (
            <div key={column} className="px-5 sm:px-7">
              <EmptyState
                symbol={column === 1 ? 'A' : 'B'}
                title={`Model response ${column}`}
                description="No provider is connected, so there is no real response to display."
              />
            </div>
          ))}
        </div>

        <div className="border-t border-[#EEEAF4] bg-[#FAF9FC] p-4 sm:p-5">
          <label htmlFor="comparison-prompt" className="sr-only">Prompt to compare</label>
          <textarea
            id="comparison-prompt"
            disabled
            placeholder="Connect at least two models to start a comparison."
            className="min-h-[88px] w-full resize-y rounded-[14px] border border-[#E8E5EF] bg-white px-4 py-3 text-[13px] text-[#777582] placeholder:text-[#9A98A3] disabled:cursor-not-allowed disabled:bg-[#FCFBFD]"
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-[#85838F]">Each answer must be attributed to its actual provider and model.</p>
            <button type="button" disabled className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#29263A] px-4 text-[12px] font-semibold text-white opacity-40">
              Compare responses
            </button>
          </div>
        </div>
      </section>

      <div className="mt-6 text-center">
        <Link href="/models" className="text-[13px] font-medium text-[#6559DB] underline decoration-[#D8D4EA] underline-offset-4 hover:text-[#4E43BD]">
          Learn about model connections
        </Link>
      </div>
    </main>
  );
}
