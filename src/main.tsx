import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './lib/store';
import App from './App.tsx';
import './index.css';

// Initialize auth state
const initAuth = async () => {
  const { setUser } = useAuthStore.getState();

  try {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

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