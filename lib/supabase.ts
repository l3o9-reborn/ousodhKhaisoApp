import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to get the current user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  console.log("Supabase getUser data:", data);
  if (error) {
    console.error("Supabase getUser error:", error);
    return null;
  }
  return data?.user ?? null;
}
