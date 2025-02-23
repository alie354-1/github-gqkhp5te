
import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

interface FeatureFlag {
  enabled: boolean;
  visible: boolean;
}

interface FeatureFlags {
  dashboard: FeatureFlag;
  company: FeatureFlag;
  messages: FeatureFlag;
  community: FeatureFlag;
  directory: FeatureFlag;
  library: FeatureFlag;
  marketplace: FeatureFlag;
  legalHub: FeatureFlag;
  devHub: FeatureFlag;
  utilities: FeatureFlag;
  ideaHub: FeatureFlag;
  financeHub: FeatureFlag;
  settings: FeatureFlag;
  adminPanel: FeatureFlag;
}

const defaultFeatureFlags: FeatureFlags = {
  dashboard: { enabled: true, visible: true },
  company: { enabled: true, visible: true },
  messages: { enabled: true, visible: true },
  community: { enabled: true, visible: true },
  directory: { enabled: true, visible: true },
  library: { enabled: true, visible: true },
  marketplace: { enabled: true, visible: true },
  legalHub: { enabled: true, visible: true },
  devHub: { enabled: true, visible: true },
  utilities: { enabled: true, visible: true },
  ideaHub: { enabled: true, visible: true },
  financeHub: { enabled: true, visible: true },
  settings: { enabled: true, visible: true },
  adminPanel: { enabled: true, visible: true }
};

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  featureFlags: FeatureFlags;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setFeatureFlags: (flags: FeatureFlags) => void;
  fetchProfile: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAdmin: false,
  featureFlags: defaultFeatureFlags,
  setUser: (user) => {
    set({ user });
    if (user) {
      useAuthStore.getState().fetchProfile(user.id);
    }
  },
  setProfile: (profile) => set({ profile, isAdmin: profile?.role === 'admin' }),
  setFeatureFlags: (flags) => set({ featureFlags: flags }),
  fetchProfile: async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      set({ profile, isAdmin: profile?.role === 'admin' });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null, isAdmin: false });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}));
