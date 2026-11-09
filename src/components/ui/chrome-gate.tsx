'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/** Renders its children everywhere except on the chat workspace. */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/chat')) return null;
  return <>{children}</>;
}