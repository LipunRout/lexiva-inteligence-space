'use client';

import { useEffect, useState } from 'react';
import type { ModelInfo } from './types';
import { liveModelFrom, setLiveModels, type ApiModel } from './data';

let cache: ModelInfo[] | null = null;
let inflight: Promise<ModelInfo[]> | null = null;

function load(): Promise<ModelInfo[]> {
  if (cache) return Promise.resolve(cache);
  inflight ??= fetch('/api/models')
    .then((r) => r.json())
    .then((d: { models: ApiModel[] }) => {
      cache = d.models.map(liveModelFrom);
      setLiveModels(cache);
      return cache;
    })
    .catch(() => [] as ModelInfo[])
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useModels() {
  const [models, setModels] = useState<ModelInfo[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let on = true;
    load().then((list) => {
      if (on) {
        setModels(list);
        setLoading(false);
      }
    });
    return () => {
      on = false;
    };
  }, []);

  return { models, loading };
}