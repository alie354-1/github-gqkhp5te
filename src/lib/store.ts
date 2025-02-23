import create from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null; // Added profile field with any type for flexibility
  isAdmin: boolean;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: { id: '1', email: 'test@example.com' }, // Mock user data for auth bypass
  profile: { id: '1', full_name: 'Test User', role: 'admin' }, // Mock profile data
  isAdmin: true, // Set isAdmin to true for admin privileges
  signOut: async () => {
    set({ user: null, profile: null, isAdmin: false });
  },
  setUser: (user) => set({ user, profile: user?.id ? {id: user.id, full_name: 'Temp Name', role: 'user'} : null, isAdmin: user?.email?.endsWith('@admin.com') || false }),
}));