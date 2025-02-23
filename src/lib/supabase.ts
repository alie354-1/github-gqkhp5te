import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add pooling suffix to URL
const poolUrl = supabaseUrl?.includes('pooler') ? supabaseUrl : supabaseUrl?.replace('.supabase.co', '-pooler.supabase.co');

console.log('Using pooled connection:', poolUrl !== supabaseUrl);

if (!poolUrl || !supabaseAnonKey) {
  console.error('Environment variables:', {
    url: !!poolUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(poolUrl, supabaseAnonKey, {
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

// Test database connection and schema
supabase.from('profiles').select('count', { count: 'exact', head: true })
  .then(response => {
    if (response.error) {
      if (response.error.code === '42P01') {
        console.error('Profiles table does not exist. Please run migrations.');
      } else {
        console.error('Database error:', response.error);
      }
    } else {
      console.log('Database connection and schema verified successfully');
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