import Link from 'next/link';
import { PageIntro, PrototypeNotice } from '@/components/ui/product-ui';

const setupSteps = [
  {
    number: '01',
    title: 'Choose a provider',
    body: 'Select which model APIs this deployment is intended to support.',
  },
  {
    number: '02',
    title: 'Configure credentials securely',
    body: 'Store API credentials on the server in private environment variables. Never expose them in browser code.',
  },
  {
    number: '03',
    title: 'Verify and identify each model',
    body: 'Only list a model after a real provider connection succeeds, and preserve provider/model attribution on every reply.',
  },
];

export default function ModelsPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[1180px] px-4 py-10 sm:px-7 sm:py-14">
      <PageIntro
        eyebrow="Model connections"
        title="Your models, with clear attribution."
        description="Lexiva is designed to bring supported model providers into one workspace. A provider only appears as available after a real server-side connection is configured."
      />

      <PrototypeNotice>
        <strong>No providers are connected.</strong> This project does not yet
        include provider adapters, credentials, or live model availability checks.
      </PrototypeNotice>

      <section className="mt-8 rounded-[22px] border border-[#E8E5EF] bg-white p-5 shadow-[0_12px_42px_rgba(41,38,58,0.04)] sm:p-7">
        <div className="flex flex-col justify-between gap-3 border-b border-[#EEEAF4] pb-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[17px] font-semibold text-[#29263A]">Provider registry</h2>
            <p className="mt-1 text-[13px] text-[#85838F]">Connection status for this environment</p>
          </div>
          <span className="inline-flex min-h-9 items-center gap-2 self-start rounded-full bg-[#F5F2EA] px-3 text-[12px] font-medium text-[#79652F] sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D79B49]" />
            Setup required
          </span>
        </div>

        <div className="flex min-h-[180px] flex-col items-center justify-center py-8 text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#F0EDFF] text-[20px] text-[#6559DB]" aria-hidden="true">◇</span>
          <h3 className="text-[15px] font-semibold text-[#29263A]">No model connections yet</h3>
          <p className="mt-2 max-w-[440px] text-[13px] leading-6 text-[#777582]">
            Once provider adapters and private server credentials are configured,
            connected models can be listed here with their exact names and status.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-5 text-[18px] font-semibold tracking-[-0.02em] text-[#29263A]">A safe path to connecting models</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {setupSteps.map((step) => (
            <article key={step.number} className="rounded-[18px] border border-[#E8E5EF] bg-white p-5">
              <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EDFF] text-[11px] font-semibold text-[#6559DB]">
                {step.number}
              </span>
              <h3 className="text-[14px] font-semibold text-[#29263A]">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-6 text-[#777582]">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/chat" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#29263A] px-5 text-[13px] font-semibold text-white hover:bg-[#403B59]">Open chat preview</Link>
        <Link href="/compare" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#E5E2EC] bg-white px-5 text-[13px] font-semibold text-[#494655] hover:border-[#CFCBE3]">See comparison preview</Link>
      </div>
    </main>
  );
}
