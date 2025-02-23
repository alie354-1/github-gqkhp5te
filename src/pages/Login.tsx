import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Shield } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'alie+1@jointhewheel.com',
        password: 'test123'
      });

      if (error) throw error;

      if (data.user) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleLogin();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Signing you in...
        </h2>
        {error && (
          <p className="mt-2 text-center text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}