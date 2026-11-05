import Link from 'next/link';
import Image from 'next/image';

const linkGroups = [
  {
    title: 'Workspace',
    links: [
      { label: 'Start a chat', href: '/chat' },
      { label: 'Model connections', href: '/models' },
      { label: 'Compare models', href: '/compare' },
      { label: 'Conversation history', href: '/history' },
    ],
  },
  {
    title: 'About Lexiva',
    links: [
      { label: 'How it works', href: '/#workflow' },
      { label: 'Project overview', href: '/' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-[#E8E5EF] bg-[#F8F7FB]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-[#E8E3FF] opacity-60 blur-3xl"
      />
      <div className="relative mx-auto max-w-[1440px] px-5 pb-7 pt-14 sm:px-8 lg:px-12">
        <div className="grid gap-12 border-b border-[#E5E2EC] pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-[360px]">
            <Link
              href="/"
              aria-label="Lexiva Intelligence Space home"
              className="inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7468EB]"
            >
              <Image
                src="/lexiva-mark.png"
                alt=""
                aria-hidden="true"
                width={840}
                height={768}
                className="h-12 w-12 object-contain"
              />
              <span className="flex flex-col">
                <span className="text-[21px] font-semibold leading-6 tracking-[-0.05em] text-[#29263A]">
                  Lexiva
                </span>
                <span className="text-[9px] font-semibold uppercase leading-3 tracking-[0.15em] text-[#777582]">
                  Intelligence Space
                </span>
              </span>
            </Link>
            <p className="mt-4 text-[14px] leading-6 text-[#777582]">
              One thoughtful place to explore different model perspectives.
              Clear conversations, with credit where it belongs.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#E5E2EC] bg-white px-3 py-1.5 text-[11px] font-medium text-[#777582]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D79B49]" />
              AI provider connections are not configured
            </p>
          </div>

          {linkGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#777582]">
                {group.title}
              </h2>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-[#494655] transition-colors hover:text-[#6559DB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7468EB]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-5 text-[12px] text-[#85838F] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lexiva Intelligence Space</p>
          <p>Multiple models. One intelligent space.</p>
        </div>
      </div>
    </footer>
  );
}
