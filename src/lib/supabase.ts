import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key length:', supabaseAnonKey?.length);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables');
}

if (!supabaseUrl.startsWith('https://')) {
  throw new Error('Invalid Supabase URL format');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: { 'x-application-name': 'startup-os' }
  }
});

// Log any auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  if (session) {
    console.log('User:', session.user?.email);
  }
  if (event === 'SIGNED_IN') {
    console.log('Checking database access...');
    supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .limit(0)
      .then(response => {
        console.log('Database response:', response);
        if (response.error) {
          console.error('Database error:', response.error);
        }
      });
  }
});

// Test the connection
supabase.from('profiles').select('count', { count: 'exact', head: true })
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection error:', err.message));