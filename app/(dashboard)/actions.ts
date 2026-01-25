'use server';

import { signOut } from '@/lib/auth';

export async function logout() {
  try {
    await signOut({ redirectTo: '/login' });
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to sign out');
  }
}
