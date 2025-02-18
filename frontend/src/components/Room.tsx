import React, { useState } from 'react';
import axios from 'axios';

const Room: React.FC = () => {
  const [setName, setSetName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleFetchSet = async () => {
    try {
      const response = await axios.get(`https://api.scryfall.com/sets/${setName}`);
      const cardsResponse = await axios.get(response.data.search_uri);
      const cards = cardsResponse.data.data;

      // Save cards in batches
      const batchSize = 20;
      for (let i = 0; i < cards.length; i += batchSize) {
        const batch = cards.slice(i, i + batchSize);
        await axios.post('http://localhost:3000/api/cards', { cards: batch });
      }

      setMessage(`Fetched and saved ${cards.length} cards from set ${setName}`);
    } catch (error) {
      setMessage(`Error fetching set: ${(error as any).response.data}`);
    }
  };

  return (
    <div>
      <h2>Enter Magic: The Gathering Set Name</h2>
      <input
        type="text"
        placeholder="Set Name"
        value={setName}
        onChange={(e) => setSetName(e.target.value)}
      />
      <button onClick={handleFetchSet}>Fetch Set</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Room;