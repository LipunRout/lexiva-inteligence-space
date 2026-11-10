'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PageIntro } from '@/components/ui/product-ui';
import { useModels } from '@/components/chat/use-models';
import { ProviderIcon } from '@/components/chat/provider-icon';

const SUPPORTED_PROVIDERS = ['Gemini', 'Groq', 'Mistral AI', 'Cerebras', 'OpenRouter', 'Cohere'];

export default function ModelsPage() {
  const { models, loading, error } = useModels();
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('All providers');

  const providers = useMemo(
    () => Array.from(new Set(models.map((model) => model.provider))).sort(),
    [models],
  );
  const visibleModels = useMemo(() => {
    const search = query.trim().toLowerCase();
    return models.filter((model) => {
      const matchesProvider = provider === 'All providers' || model.provider === provider;
      const matchesSearch =
        !search ||
        model.name.toLowerCase().includes(search) ||
        model.provider.toLowerCase().includes(search) ||
        model.id.toLowerCase().includes(search);
      return matchesProvider && matchesSearch;
    });
  }, [models, provider, query]);

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[1180px] px-4 py-9 sm:px-7 sm:py-14">
      <PageIntro
        eyebrow="Model library"
        title="Models in your space."
        description="Explore the models currently listed by Lexiva's server-side provider configuration. Only listed models can be selected in chat; provider credentials are never shown here."
      />

      <section className="relative mb-8 overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#17171c] p-5 sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-indigo-500/[0.12] blur-3xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-[510px]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/[0.16] bg-emerald-300/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-100/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              {loading ? 'Checking model list' : `${models.length} ${models.length === 1 ? 'model' : 'models'} listed`}
            </div>
            <h2 className="text-[20px] font-medium tracking-[-0.035em] text-white sm:text-[23px]">
              One space, multiple model perspectives.
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-white/55">
              This list reflects models returned to this deployment. Availability can change with provider configuration.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[250px]">
            <div className="rounded-[16px] border border-white/[0.07] bg-white/[0.035] p-4">
              <p className="text-[23px] font-medium tracking-[-0.04em] text-white">{loading ? '—' : models.length}</p>
              <p className="mt-1 text-[11px] text-white/45">Models listed</p>
            </div>
            <div className="rounded-[16px] border border-white/[0.07] bg-white/[0.035] p-4">
              <p className="text-[23px] font-medium tracking-[-0.04em] text-white">{loading ? '—' : providers.length}</p>
              <p className="mt-1 text-[11px] text-white/45">Providers represented</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="available-models-heading">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/35">Directory</p>
            <h2 id="available-models-heading" className="text-[20px] font-medium tracking-[-0.035em] text-white">
              Available to this workspace
            </h2>
          </div>
          <label className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 text-white/45 focus-within:border-white/20 sm:max-w-[300px]">
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
              <circle cx="7.2" cy="7.2" r="4.8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.8 10.8L13.8 13.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="sr-only">Search models</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search models or providers"
              className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-white/35 sm:text-[13px]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="rounded-md px-1 text-[11px] text-white/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                aria-label="Clear model search"
              >
                Clear
              </button>
            )}
          </label>
        </div>

        {providers.length > 1 && (
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Filter models by provider">
            {['All providers', ...providers].map((name) => {
              const active = name === provider;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setProvider(name)}
                  className={`inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 ${
                    active
                      ? 'border-white bg-white text-[#17171c]'
                      : 'border-white/[0.1] bg-white/[0.035] text-white/60 hover:bg-white/[0.08]'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        )}

        {error ? (
          <div role="alert" className="rounded-[20px] border border-rose-300/15 bg-rose-300/[0.05] px-5 py-10 text-center">
            <h3 className="text-[16px] font-semibold text-white">We couldn&apos;t load the model list</h3>
            <p className="mx-auto mt-2 max-w-[430px] text-[13px] leading-6 text-white/55">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex min-h-10 items-center rounded-xl border border-white/[0.12] px-4 text-[12px] font-medium text-white hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading models">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-[150px] animate-pulse rounded-[18px] border border-white/[0.07] bg-white/[0.025]" />
            ))}
          </div>
        ) : visibleModels.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleModels.map((model) => (
              <article
                key={model.id}
                className="group rounded-[18px] border border-white/[0.08] bg-[#151519] p-4 transition-colors hover:border-white/[0.15] hover:bg-[#19191f] sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <ProviderIcon model={model} size={38} />
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-medium tracking-[-0.02em] text-white">{model.name}</p>
                      <p className="mt-1 text-[12px] text-white/45">{model.provider}</p>
                    </div>
                  </div>
                  <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-300/[0.14] bg-emerald-300/[0.06] px-2 py-1 text-[10px] font-medium text-emerald-100/75">
                    <span className="h-1 w-1 rounded-full bg-emerald-300" />
                    Listed
                  </span>
                </div>
                <div className="mt-5 border-t border-white/[0.07] pt-3">
                  <p className="truncate font-mono text-[11px] text-white/40" title={model.id}>{model.id}</p>
                  <p className="mt-2 text-[11px] text-white/35">Available in the chat model selector</p>
                </div>
              </article>
            ))}
          </div>
        ) : models.length ? (
          <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.025] px-5 py-12 text-center">
            <h3 className="text-[15px] font-semibold text-white">No matching models</h3>
            <p className="mt-2 text-[13px] text-white/50">Try a different search or provider filter.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#151519]">
            <div className="px-5 py-9 text-center sm:px-8">
              <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-[15px] border border-white/[0.09] bg-white/[0.04] text-[19px] text-white/65" aria-hidden="true">
                ◇
              </span>
              <h3 className="text-[16px] font-semibold text-white">No models are listed yet</h3>
              <p className="mx-auto mt-2 max-w-[490px] text-[13px] leading-6 text-white/50">
                Add a supported provider&apos;s API key to the server environment and restart Lexiva. Keys stay server-side; this page never displays their values.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {SUPPORTED_PROVIDERS.map((name) => (
                  <span key={name} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] text-white/45">
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/[0.07] bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12px] leading-5 text-white/45">Configure credentials in private server environment variables—not in client code.</p>
              <Link href="/chat" className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-white px-4 text-[12px] font-semibold text-[#17171c] hover:bg-white/90">
                Open chat
              </Link>
            </div>
          </div>
        )}
      </section>

      <p className="mt-7 text-[11px] leading-5 text-white/35">
        A model appears here when its provider is configured and returns it to Lexiva. Provider availability and usage limits are managed by each provider.
      </p>
    </main>
  );
}
