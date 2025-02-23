import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables');
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
    schema: 'public',
    autoRefreshToken: true
  },
  global: {
    headers: { 'x-application-name': 'startup-os' }
  }
});

// Test database connection and schema
console.log('Testing Supabase connection...');
console.log('Database URL format:', supabaseUrl?.split('@')[1] || 'Not found');

supabase.from('profiles').select('count', { count: 'exact', head: true })
  .then(response => {
    if (response.error) {
      console.error('Database connection test failed:');
      console.error('Error code:', response.error.code);
      console.error('Error message:', response.error.message);
      console.error('Error details:', response.error.details);
      if (response.error.code === '42P01') {
        console.error('Profiles table does not exist - migrations need to be run');
      }
    } else {
      console.log('Database connection and schema verified successfully');
      console.log('Response:', response);
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