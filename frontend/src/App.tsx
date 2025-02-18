import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Auth from './components/Auth';
import Rooms from './components/Rooms';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>MTG Draft Simulator</h1>
        <nav>
          <Link to="/signup"><button>Sign Up</button></Link>
          <Link to="/login"><button>Login</button></Link>
          <Link to="/rooms"><button>Rooms</button></Link>
        </nav>
        <Routes>
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/rooms" element={<Rooms />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
