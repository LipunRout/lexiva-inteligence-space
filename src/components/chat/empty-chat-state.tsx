'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SuggestedPrompts } from './suggested-prompts';
import { useModels } from './use-models';

export function EmptyChatState({
  onPick,
  children,
}: {
  onPick: (text: string) => void;
  children: React.ReactNode;
}) {
  const { models, loading } = useModels();

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[640px] text-center"
      >
        <h1 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-[#f4f4f6] sm:text-[42px]">
          What would you like to explore?
        </h1>
        <p className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-6 text-[#8e8d95] sm:text-[16px]">
          One workspace. Multiple perspectives. Infinite possibilities.
        </p>

        <div className="mt-8 text-left">{children}</div>

        <div className="mt-4">
          <SuggestedPrompts onPick={onPick} />
        </div>

        {!loading && models.length === 0 && (
          <p className="mx-auto mt-6 max-w-[52ch] rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3 text-[12.5px] leading-5 text-amber-100/80">
            No AI providers are configured yet. Add an API key to <code>.env.local</code> and restart the server.
          </p>
        )}
      </motion.div>
    </div>
  );
}