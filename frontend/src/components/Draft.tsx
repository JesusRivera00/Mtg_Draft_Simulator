import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Draft.css'; 
interface Card {
  id: string;
  name: string;
  image_uris: { normal: string };
}

const Draft: React.FC = () => {
  const location = useLocation();
  const { setName } = location.state as { setName: string };
  const [pack, setPack] = useState<Card[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchPack = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/draft/pack', { setName });
        setPack(response.data.pack);
      } catch (error) {
        setMessage(`Error fetching pack: ${error.response?.data?.error || error.message}`);
      }
    };

    fetchPack();
  }, [setName]);

  return (
    <div>
      <h2>Draft</h2>
      {message && <p>{message}</p>}
      <div className="pack">
        {pack.map(card => (
          <img
            key={card.id}
            src={card.image_uris.normal}
            alt={card.name}
            className="card-image"
          />
        ))}
      </div>
    </div>
  );
};

export default Draft;