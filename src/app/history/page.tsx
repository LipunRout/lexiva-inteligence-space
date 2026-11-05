import Link from 'next/link';
import { EmptyState, PageIntro, PrototypeNotice } from '@/components/ui/product-ui';

export default function HistoryPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[1180px] px-4 py-10 sm:px-7 sm:py-14">
      <PageIntro
        eyebrow="Your conversations"
        title="A place to pick up the thread."
        description="Saved conversations will make it easy to revisit useful ideas and continue where you left off."
      />

      <PrototypeNotice>
        <strong>Conversation history is not enabled.</strong> The current
        prototype does not save messages or associate them with an account.
      </PrototypeNotice>

      <section className="mt-8 rounded-[22px] border border-[#E8E5EF] bg-white shadow-[0_12px_42px_rgba(41,38,58,0.04)]">
        <EmptyState
          symbol="↺"
          title="Your history will appear here"
          description="Once conversations can be securely saved, you will be able to search, revisit, and continue them from this space."
        />
        <div className="border-t border-[#EEEAF4] bg-[#FAF9FC] px-5 py-4 text-center text-[11px] leading-5 text-[#85838F] sm:rounded-b-[22px]">
          No conversations are stored by this prototype.
        </div>
      </section>

      <div className="mt-6 text-center">
        <Link href="/chat" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#29263A] px-5 text-[13px] font-semibold text-white hover:bg-[#403B59]">
          Open chat preview
        </Link>
      </div>
    </main>
  );
}
