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
  user: { id: '38d3420e-3811-4ba2-82b1-934f79d5c44b', email: 'aliecohen@gmail.com' }, // Mock user data
  profile: { id: '38d3420e-3811-4ba2-82b1-934f79d5c44b', full_name: 'Alie Cohen', role: 'admin' }, // Mock profile data
  isAdmin: true, // Set isAdmin to true for admin privileges
  signOut: async () => {
    set({ user: null, profile: null, isAdmin: false });
  },
  setUser: (user) => set({ user, profile: user?.id ? {id: user.id, full_name: 'Temp Name', role: 'user'} : null, isAdmin: user?.email?.endsWith('@admin.com') || false }),
}));