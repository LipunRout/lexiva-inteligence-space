'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useModels } from '@/components/chat/use-models';
import { ProviderIcon } from '@/components/chat/provider-icon';
import type { ModelInfo } from '@/components/chat/types';

interface ComparisonResult {
  modelId: string;
  ok: boolean;
  text?: string;
  error?: string;
  ms: number;
}

const ACCENTS = [
  { text: 'text-[#B9ACFF]', border: 'border-[#B9ACFF]/[0.08]', marker: 'bg-[#B9ACFF]' },
  { text: 'text-[#E9B58A]', border: 'border-[#E9B58A]/[0.08]', marker: 'bg-[#E9B58A]' },
  { text: 'text-[#92D6C1]', border: 'border-[#92D6C1]/[0.08]', marker: 'bg-[#92D6C1]' },
  { text: 'text-[#E99BAE]', border: 'border-[#E99BAE]/[0.08]', marker: 'bg-[#E99BAE]' },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isComparisonResult(value: unknown): value is ComparisonResult {
  if (!isRecord(value)) return false;
  return (
    typeof value.modelId === 'string' &&
    typeof value.ok === 'boolean' &&
    typeof value.ms === 'number' &&
    Number.isFinite(value.ms) &&
    value.ms >= 0 &&
    (value.ok ? typeof value.text === 'string' : typeof value.error === 'string')
  );
}

function modelErrorMessage(body: unknown) {
  return isRecord(body) && typeof body.error === 'string' ? body.error : null;
}

export function CompareWorkspace() {
  const { models, loading: modelsLoading, error: modelsError } = useModels();
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<ComparisonResult[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signInRequired, setSignInRequired] = useState(false);

  useEffect(() => {
    setSelectedModelIds((current) => {
      const availableIds = new Set(models.map((model) => model.id));
      const valid = current.filter((id) => availableIds.has(id)).slice(0, 4);
      const required = Math.min(models.length, 2);
      if (valid.length >= required) return valid;

      const additions = models
        .filter((model) => !valid.includes(model.id))
        .slice(0, required - valid.length)
        .map((model) => model.id);

      return [...valid, ...additions];
    });
  }, [models]);

  const selectedModels = selectedModelIds
    .map((id) => models.find((model) => model.id === id))
    .filter((model): model is ModelInfo => !!model);
  const canCompare = selectedModels.length >= 2 && !modelsLoading && !modelsError;

  function clearComparison() {
    setResults(null);
    setError(null);
    setSignInRequired(false);
  }

  function selectModel(index: number, modelId: string) {
    setSelectedModelIds((current) =>
      current.map((id, currentIndex) => (currentIndex === index ? modelId : id)),
    );
    clearComparison();
  }

  function addModel() {
    const next = models.find((model) => !selectedModelIds.includes(model.id));
    if (!next || selectedModelIds.length >= 4) return;
    setSelectedModelIds((current) => [...current, next.id]);
    clearComparison();
  }

  function removeModel(index: number) {
    if (selectedModelIds.length <= 2) return;
    setSelectedModelIds((current) => current.filter((_, currentIndex) => currentIndex !== index));
    clearComparison();
  }

  async function submitComparison(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || selectedModels.length < 2 || busy) return;

    setBusy(true);
    setResults(null);
    setError(null);
    setSignInRequired(false);

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ models: selectedModels.map((model) => model.id), prompt: cleanPrompt }),
      });

      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 401) setSignInRequired(true);
        throw new Error(
          modelErrorMessage(body) ??
            (response.status === 401
              ? 'Your session has expired. Sign in again to compare responses.'
              : `The comparison service returned an error (${response.status}).`),
        );
      }

      if (!isRecord(body) || !Array.isArray(body.results) || !body.results.every(isComparisonResult)) {
        throw new Error('The comparison service returned an invalid response. Please try again.');
      }

      const nextResults = body.results;
      const expectedIds = new Set(selectedModels.map((model) => model.id));
      const resultIds = new Set(nextResults.map((result) => result.modelId));
      if (
        nextResults.length !== expectedIds.size ||
        resultIds.size !== nextResults.length ||
        nextResults.some((result) => !expectedIds.has(result.modelId))
      ) {
        throw new Error('The comparison service returned incomplete results. Please try again.');
      }

      setResults(nextResults);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to compare responses. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-labelledby="workspace-title"
      className="mt-7 overflow-hidden rounded-[26px] border border-white/[0.1] bg-[#0b0b0e] shadow-[0_28px_90px_rgba(0,0,0,0.3)]"
    >
      <div className="flex flex-col gap-4 border-b border-white/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-white/35">
            Comparison studio <span className="px-1 text-white/20">/</span> 01
          </p>
          <h2 id="workspace-title" className="mt-1 text-[17px] font-medium tracking-[-0.02em] text-[#f4f1ea]">
            Response workspace
          </h2>
        </div>
        <span className="inline-flex min-h-9 w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3.5 text-[11px] font-medium text-white/55">
          <span className={`h-1.5 w-1.5 rounded-full ${busy ? 'animate-pulse bg-[#c5b9ff]' : canCompare ? 'bg-emerald-300' : 'bg-white/35'}`} />
          {busy ? 'Comparing models' : `${selectedModels.length} of 4 model slots`}
        </span>
      </div>

      {modelsError ? (
        <div role="alert" className="m-5 rounded-2xl border border-rose-300/15 bg-rose-300/[0.05] p-5 sm:m-7">
          <h3 className="text-[14px] font-semibold text-white">Could not load available models</h3>
          <p className="mt-2 text-[12px] leading-5 text-white/55">{modelsError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex min-h-9 items-center rounded-full border border-white/[0.12] px-4 text-[11px] font-medium text-white/75 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
          >
            Try again
          </button>
        </div>
      ) : modelsLoading ? (
        <div role="status" className="p-8 text-center text-[13px] text-white/50">
          Loading models available to this workspace…
        </div>
      ) : models.length === 0 ? (
        <div className="m-5 rounded-[20px] border border-white/[0.08] bg-white/[0.025] px-5 py-10 text-center sm:m-7">
          <h3 className="text-[15px] font-semibold text-white">No models are available yet</h3>
          <p className="mx-auto mt-2 max-w-[430px] text-[12px] leading-5 text-white/50">
            Configure a provider on the server, then return here to compare its listed models.
          </p>
          <Link
            href="/models"
            className="mt-4 inline-flex min-h-9 items-center rounded-full border border-white/[0.12] px-4 text-[11px] font-medium text-white/75 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
          >
            Open model setup
          </Link>
        </div>
      ) : (
        <div className="grid gap-px bg-white/[0.08] sm:grid-cols-2">
          {selectedModels.map((model, index) => {
            const accent = ACCENTS[index % ACCENTS.length];
            const result = results?.find((item) => item.modelId === model.id);

            return (
              <article
                key={`${index}-${model.id}`}
                className="relative min-h-[270px] overflow-hidden bg-[#0b0b0e] px-5 py-6 sm:px-7 sm:py-7"
              >
                <div aria-hidden="true" className="absolute inset-0 opacity-60">
                  <div className={`absolute -right-12 -top-16 h-48 w-48 rounded-full border ${accent.border}`} />
                  <div className={`absolute -right-2 -top-6 h-28 w-28 rounded-full border ${accent.border}`} />
                </div>

                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-[11px] font-semibold ${accent.text}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                        Perspective {String.fromCharCode(65 + index)}
                      </p>
                      <div className="mt-1 flex min-w-0 items-center gap-2">
                        <ProviderIcon model={model} size={20} />
                        <p className="truncate text-[12px] font-medium text-white/80">{model.provider}</p>
                      </div>
                    </div>
                  </div>
                  {selectedModelIds.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeModel(index)}
                      disabled={busy}
                      aria-label={`Remove ${model.name} from comparison`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[18px] text-white/40 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ×
                    </button>
                  )}
                </div>

                <label htmlFor={`compare-model-${index}`} className="sr-only">
                  Model for perspective {index + 1}
                </label>
                <select
                  id={`compare-model-${index}`}
                  value={model.id}
                  disabled={busy}
                  onChange={(event) => selectModel(index, event.target.value)}
                  className="relative mt-4 min-h-10 w-full rounded-xl border border-white/[0.09] bg-[#121216] px-3 text-[12px] text-white/85 outline-none focus-visible:border-[#c5b9ff]/50 focus-visible:ring-2 focus-visible:ring-[#c5b9ff]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {models.map((option) => (
                    <option
                      key={option.id}
                      value={option.id}
                      disabled={selectedModelIds.some((id, selectedIndex) => id === option.id && selectedIndex !== index)}
                    >
                      {option.name} · {option.provider}
                    </option>
                  ))}
                </select>

                <div className="relative mt-5 border-l border-dashed border-white/[0.12] pl-5">
                  {busy ? (
                    <p role="status" className="text-[13px] font-medium text-white/70">
                      Waiting for {model.provider}…
                    </p>
                  ) : result?.ok ? (
                    <>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-[10px] font-medium text-emerald-200/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                          Response received
                        </span>
                        <span className="text-[10px] text-white/35">
                          {Math.max(1, Math.round(result.ms / 1000))}s
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap break-words text-[13px] leading-6 text-white/80">
                        {result.text}
                      </p>
                    </>
                  ) : result ? (
                    <div role="alert">
                      <p className="text-[12px] font-semibold text-rose-200/90">This model could not respond</p>
                      <p className="mt-1 break-words text-[11px] leading-5 text-white/45">{result.error}</p>
                      {result.ms > 0 && (
                        <p className="mt-2 text-[10px] text-white/30">
                          Failed after {Math.max(1, Math.round(result.ms / 1000))}s
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-[13px] font-medium text-white/75">Ready for your prompt.</p>
                      <p className="mt-2 max-w-[330px] text-[12px] leading-5 text-white/40">
                        This model will receive the same prompt as every other selected perspective.
                      </p>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <form onSubmit={submitComparison} className="border-t border-white/[0.08] bg-[#101014] p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <label htmlFor="comparison-prompt" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
            Shared prompt
          </label>
          <span className="text-[10px] text-white/30">{prompt.length.toLocaleString()} / 20,000</span>
        </div>
        <textarea
          id="comparison-prompt"
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
            clearComparison();
          }}
          disabled={!canCompare || busy}
          maxLength={20000}
          required
          placeholder={models.length < 2 ? 'At least two available models are needed to compare.' : 'What would you like the models to answer?'}
          className="min-h-[100px] w-full resize-y rounded-[15px] border border-white/[0.09] bg-[#0a0a0d] px-4 py-3 text-[14px] leading-6 text-white/85 outline-none placeholder:text-white/25 focus-visible:border-[#c5b9ff]/45 focus-visible:ring-2 focus-visible:ring-[#c5b9ff]/15 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            {models.length < 2 && !modelsLoading && !modelsError ? (
              <p className="text-[11px] leading-5 text-amber-100/70">
                Add another model in <Link href="/models" className="underline underline-offset-2">Models</Link> before comparing.
              </p>
            ) : (
              <p className="max-w-[470px] text-[11px] leading-5 text-white/35">
                Runs each selected model in parallel. Comparison results are not saved to chat history.
              </p>
            )}
            {error && (
              <p role="alert" className="text-[12px] leading-5 text-rose-200/90">
                {error}{' '}
                {signInRequired && (
                  <Link href="/login?next=%2Fcompare" className="underline underline-offset-2">
                    Sign in
                  </Link>
                )}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {models.length >= 2 && selectedModelIds.length < Math.min(models.length, 4) && (
              <button
                type="button"
                onClick={addModel}
                disabled={busy}
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/[0.1] px-4 text-[11px] font-medium text-white/65 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-40"
              >
                + Add model
              </button>
            )}
            <button
              type="submit"
              disabled={!canCompare || !prompt.trim() || busy}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#f4f1ea] px-5 text-[12px] font-semibold text-[#111113] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c5b9ff] disabled:cursor-not-allowed disabled:opacity-35 motion-reduce:transition-none"
            >
              {busy ? 'Comparing…' : 'Compare responses'}
              {!busy && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
