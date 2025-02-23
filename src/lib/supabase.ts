import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true,
    emailAuth: {
      requireVerification: false
    }
  },
  db: {
    schema: 'public',
    autoRefreshToken: true
  },
  global: {
    headers: { 'x-application-name': 'startup-os' }
  }
});

// Test database connection
supabase.from('profiles').select('count', { count: 'exact', head: true })
  .then(response => {
    if (response.error) {
      console.error('Database connection test failed:', response.error);
    } else {
      console.log('Database connection successful');
    }
  })
  .catch(err => {
    console.error('Connection error:', err);
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