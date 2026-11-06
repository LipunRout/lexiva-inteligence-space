import React from 'react';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Intelligence } from '@/components/sections/intelligence';
import { Perspectives } from '@/components/sections/perspectives';
import { Workspaces } from '@/components/sections/workspaces';
import { GetStarted } from '@/components/sections/get-started';
import { AskLexiva } from '@/components/ui/ask-lexiva';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <main>
        <Hero />
        <About />
        <Intelligence />
        <Perspectives />
        <Workspaces />
        <GetStarted />
      </main>
      <AskLexiva />
    </div>
  );
}