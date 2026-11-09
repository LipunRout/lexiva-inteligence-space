
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
    let mounted = true;

    sb.auth.getUser().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } else {
        setUser(data.user ? toUser(data.user) : null);
      }

      setLoading(false);
    });

    const { data: sub } = sb.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        setUser(session?.user ? toUser(session.user) : null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
