import React from 'react';
import Auth from './components/Auth';
import Rooms from './components/Rooms';
import './App.css';

const App: React.FC = () => {
  return (
    <div>
      <h1>MTG Draft Simulator</h1>
      <Auth />
      <Rooms />
    </div>
  );
};

export default App;
