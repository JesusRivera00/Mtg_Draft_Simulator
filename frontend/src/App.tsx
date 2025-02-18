import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Auth from './components/Auth';
import Rooms from './components/Rooms';
import Room from './components/Room';
import Draft from './components/Draft';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Router>
      <div>
        <h1>MTG Draft Simulator</h1>
        <nav>
          {!user ? (
            <>
              <Link to="/signup"><button>Sign Up</button></Link>
              <Link to="/login"><button>Login</button></Link>
            </>
          ) : (
            <div>
              <span>Welcome, {user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
          <Link to="/rooms"><button>Rooms</button></Link>
        </nav>
        <Routes>
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/draft" element={<Draft />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
