import { createClient } from "./client"

export async function getCurrentUser() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error("Supabase getUser error:", error)
    return null
  }
  const user = data?.user
  if (!user) return null
  return {
    name: user.user_metadata?.full_name || user.email,
    email: user.email,
    avatar: user.user_metadata?.avatar_url || "/avatars/shadcn.jpg",
  }
}