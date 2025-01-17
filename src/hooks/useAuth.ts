import { useState, useEffect } from 'react';
import { getSession, signOut as authSignOut } from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const { session } = await getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  }

  async function signOut() {
    await authSignOut();
    setUser(null);
  }

  return { user, loading, signOut };
}