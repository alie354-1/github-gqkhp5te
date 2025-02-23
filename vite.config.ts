import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  },
  base: '/',
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js', '@supabase/auth-ui-react'],
          'lucide-vendor': ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});