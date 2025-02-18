import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

interface AuthProps {
  mode: 'signup' | 'login';
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      console.log('User signed up:', data.user);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignIn = async () => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      console.log('User signed in:', data.user);
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>{mode === 'signup' ? 'Sign Up' : 'Login'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {mode === 'signup' ? (
        <button onClick={handleSignUp}>Sign Up</button>
      ) : (
        <button onClick={handleSignIn}>Login</button>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Auth;