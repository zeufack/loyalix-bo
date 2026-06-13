'use server';

import { signOut } from '@/lib/auth';

export async function logout() {
  // Clear the session without redirecting. Redirecting here throws
  // NEXT_REDIRECT, which the client's await would catch as a false error.
  await signOut({ redirect: false });
}
