// lib/auth.ts
import { createClient } from '@/lib/server'

export async function getUserId(): Promise<string | null> {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  console.log('Authenticated user:', user);
  return user.id;
}



// import { createClient } from './server'; // Reuse your createClient function
// import { cookies } from 'next/headers';

// export async function getUserId(): Promise<string | null> {
//   try {
//     // Create Supabase client
//     const supabase = await createClient();

//     // Retrieve the user from Supabase session
//     const { data: { user }, error } = await supabase.auth.getUser();

//     // If there's an error or no user, return null
//     if (error || !user) {
//       console.error("No authenticated user found:", error);
//       return null;
//     }

//     // Return the userId
//     return user.id;
//   } catch (error) {
//     console.error('Error fetching userId:', error);
//     return null;
//   }
// }
