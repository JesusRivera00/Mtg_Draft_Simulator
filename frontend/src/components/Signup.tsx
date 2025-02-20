import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await axios.post<{ userId: string }>('http://localhost:3000/api/signup', { email, password });
      const userId = response.data.userId;
      localStorage.setItem('userId', userId); // Save userId to localStorage
      navigate('/rooms');
    } catch (error: any) {
      setMessage(`Error signing up: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
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
      <button onClick={handleSignup}>Sign Up</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;