import React from 'react';
import type { ModelInfo } from './types';

export function ProviderIcon({ model, size = 28 }: { model: ModelInfo; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-lg font-bold text-[#020819]"
      style={{ width: size, height: size, background: model.color, fontSize: size * 0.45 }}
    >
      {model.name.charAt(0)}
    </span>
  );
}