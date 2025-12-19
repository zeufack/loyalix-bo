import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../../types/user';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null; // You might want to define a more specific type for user
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      logout: () => set({ accessToken: null, refreshToken: null, user: null })
    }),
    {
      name: 'auth-storage', // name of the item in storage (e.g., localStorage)
      storage: createJSONStorage(() => localStorage) // Use localStorage for persistence
    }
  )
);
