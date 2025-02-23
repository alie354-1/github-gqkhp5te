import create from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null; 
  isAdmin: boolean;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  featureFlags: { [key: string]: { enabled: boolean; visible: boolean } };
  setFeatureFlags: (flags: { [key: string]: { enabled: boolean; visible: boolean } }) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: { id: '38d3420e-3811-4ba2-82b1-934f79d5c44b', email: 'aliecohen@gmail.com' }, 
  profile: { id: '38d3420e-3811-4ba2-82b1-934f79d5c44b', full_name: 'Alie Cohen', role: 'admin' }, 
  isAdmin: true, 
  signOut: async () => {
    set({ user: null, profile: null, isAdmin: false, featureFlags: {} });
  },
  setUser: (user) => set({ user, profile: user?.id ? {id: user.id, full_name: 'Temp Name', role: 'user'} : null, isAdmin: user?.email?.endsWith('@admin.com') || false, featureFlags: {} }),
  featureFlags: {},
  setFeatureFlags: (flags) => set({ featureFlags: flags }),
}));