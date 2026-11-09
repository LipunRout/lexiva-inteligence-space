'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SUGGESTIONS } from './data';

export function SuggestedPrompts({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {SUGGESTIONS.map((s, i) => (
        <motion.button
          key={s.title}
          type="button"
          onClick={() => onPick(s.text)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 + i * 0.06, duration: 0.28 }}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/[0.095] bg-[#26262c] px-4 text-[14px] font-medium tracking-[-0.011em] text-[#f4f4f6] shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset] transition-colors hover:border-white/[0.15] hover:bg-[#2d2d34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
        >
          <span className="text-[12px] text-[#8e8d95]" aria-hidden="true">{s.icon}</span>
          {s.title}
        </motion.button>
      ))}
    </div>
  );
}