'use client';

import { useEffect, useState } from 'react';
import type { ModelInfo } from './types';
import { liveModelFrom, setLiveModels, type ApiModel } from './data';

let cache: ModelInfo[] | null = null;
let inflight: Promise<ModelInfo[]> | null = null;

function load(): Promise<ModelInfo[]> {
  if (cache) return Promise.resolve(cache);
  inflight ??= fetch('/api/models')
    .then(async (response) => {
      if (!response.ok) throw new Error('The model service returned an error.');
      const data: { models?: ApiModel[] } = await response.json();
      if (!Array.isArray(data.models)) throw new Error('The model service returned an invalid response.');
      cache = data.models.map(liveModelFrom);
      setLiveModels(cache);
      return cache;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useModels() {
  const [models, setModels] = useState<ModelInfo[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let on = true;
    load().then((list) => {
      if (on) {
        setModels(list);
        setLoading(false);
      }
    }).catch((cause: unknown) => {
      if (on) {
        setError(cause instanceof Error ? cause.message : 'Unable to load models. Please try again.');
        setLoading(false);
      }
    });
    return () => {
      on = false;
    };
  }, []);

  return { models, loading, error };
}