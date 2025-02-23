import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './lib/store';
import App from './App.tsx';
import './index.css';

// Initialize auth state
const initAuth = async () => {
  const { setUser, fetchProfile } = useAuthStore.getState();

  try {
    // Get initial session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session error:', sessionError);
      setUser(null);
      return;
    }

    if (session?.user) {
      console.log('Setting initial user:', session.user.email);
      setUser(session.user);
      await fetchProfile(session.user.id);
    } else {
      console.log('No initial session found');
      setUser(null);
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error('Error initializing auth:', error);
    setUser(null);
  }
};

// Initialize auth before rendering
initAuth().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Router>
        <App />
      </Router>
    </StrictMode>
  );
});