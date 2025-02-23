import create from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  signOut: async () => {
    set({ user: null, isAdmin: false });
  },
  setUser: (user) => set({ user, isAdmin: user?.email?.endsWith('@admin.com') || false }),
}));