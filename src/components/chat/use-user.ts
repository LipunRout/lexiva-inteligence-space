'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/lib/supabase-browser';

export interface AppUser {
  id: string;
  email: string | null;
  name: string;
  avatarUrl: string | null;
}

function toUser(u: User): AppUser {
  const meta = (u.user_metadata ?? {}) as Record<string, string | undefined>;
  const email = u.email ?? null;
  return {
    id: u.id,
    email,
    name: meta.full_name ?? meta.name ?? email?.split('@')[0] ?? 'User',
    avatarUrl: meta.avatar_url ?? meta.picture ?? null,
  };
}

export function useUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data }) => {
      setUser(data.user ? toUser(data.user) : null);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toUser(session.user) : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, loading };
}