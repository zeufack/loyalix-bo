'use client';

import { useTransition } from 'react';
import { logout } from '../actions';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logout();
      } catch (error) {
        toast.error('Failed to sign out', {
          description: 'Please try again or refresh the page.',
        });
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="w-full text-left flex items-center gap-2 cursor-pointer"
    >
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      {isPending ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
