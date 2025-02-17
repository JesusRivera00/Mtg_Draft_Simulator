import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const Auth: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else console.log('User signed up:', data.user);
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else console.log('User signed in:', data.user);
  };

  return (
    <div>
      <h2>Auth</h2>
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
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn}>Sign In</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Auth;