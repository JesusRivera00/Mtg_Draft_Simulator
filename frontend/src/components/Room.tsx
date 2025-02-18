import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Set {
  code: string;
  name: string;
  set_type: string;
}

const Room: React.FC = () => {
  const [sets, setSets] = useState<Set[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await axios.get('https://api.scryfall.com/sets');
        const mainSets = response.data.data.filter((set: Set) =>
          ['core', 'masters'].includes(set.set_type)
        );
        setSets(mainSets);
      } catch (error) {
        setMessage(`Error fetching sets: ${error.response?.data?.error || error.message}`);
      }
    };

    fetchSets();
  }, []);

  const handleFetchSet = async () => {
    try {
      navigate('/draft', { state: { setName: selectedSet } });
    } catch (error) {
      setMessage(`Error starting draft: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div>
      <h2>Select Magic: The Gathering Set</h2>
      <select value={selectedSet} onChange={(e) => setSelectedSet(e.target.value)}>
        <option value="">Select a set</option>
        {sets.map(set => (
          <option key={set.code} value={set.code}>{set.name}</option>
        ))}
      </select>
      <button onClick={handleFetchSet} disabled={!selectedSet}>Start Draft</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Room;