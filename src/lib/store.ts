
import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

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

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  featureFlags: FeatureFlags;
  setFeatureFlags: (flags: FeatureFlags) => void;
  signOut: () => Promise<void>;
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAdmin: false,
  featureFlags: defaultFeatureFlags,
  setFeatureFlags: (flags) => set({ featureFlags: flags }),
  signOut: async () => {
    set({ user: null, profile: null, isAdmin: false });
  }
}));
