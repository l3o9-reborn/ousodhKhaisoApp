// lib/auth.ts
import { createClient } from '@/lib/client';
import { cookies } from 'next/headers';

export async function getUserId(): Promise<string | null> {
  const supabase = createClient(cookies());

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.id;
}
