'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/** Hides shared site chrome on the chat workspace and its sign-in screen. */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const isChatRoute = pathname?.startsWith('/chat');
  const isChatSignIn =
    pathname === '/login' && (next === '/chat' || next?.startsWith('/chat/') === true);

  if (isChatRoute || isChatSignIn) return null;
  return <>{children}</>;
}