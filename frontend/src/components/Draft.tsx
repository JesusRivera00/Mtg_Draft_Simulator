import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Draft.css'; 
interface Card {
  id: string;
  name: string;
  image_uris: { normal: string };
  edhrec_rank: number;
  mana_cost: string;
  colors: string[];
}

const Draft: React.FC = () => {
  const location = useLocation();
  const { setName } = location.state as { setName: string };
  const [packs, setPacks] = useState<Card[][][]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [userPackIndex, setUserPackIndex] = useState<number>(0);
  const [deck, setDeck] = useState<Card[]>([]);
  const [message, setMessage] = useState<string>('');
  const [deckList, setDeckList] = useState<string>('');

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/draft/packs', { setName });
        setPacks(response.data.packs);
      } catch (error) {
        setMessage(`Error fetching packs: ${error.response?.data?.error || error.message}`);
      }
    };

    fetchPacks();
  }, [setName]);

  const draftBots = (pack: Card[]) => {
    // Select the card with the highest rating
    const selectedCard = pack.reduce((highestRatedCard, currentCard) => {
      return currentCard.edhrec_rank < highestRatedCard.edhrec_rank ? currentCard : highestRatedCard;
    });
    return selectedCard;
  };

  const handleCardSelect = (selectedCard: Card) => {
    setDeck([...deck, selectedCard]);
    const updatedPacks = packs.map((round, roundIndex) => {
      if (roundIndex === currentRound) {
        return round.map((pack, packIndex) => {
          if (packIndex === userPackIndex) {
            return pack.filter(card => card.id !== selectedCard.id);
          }
          return pack;
        });
      }
      return round;
    });

    // Simulate bots selecting cards
    for (let i = 0; i < 7; i++) {
      const botPackIndex = (userPackIndex + i + 1) % 8;
      const botSelectedCard = draftBots(updatedPacks[currentRound][botPackIndex]);
      updatedPacks[currentRound][botPackIndex] = updatedPacks[currentRound][botPackIndex].filter(card => card.id !== botSelectedCard.id);
    }

    setPacks(updatedPacks);

    // Move to the next pack
    if (currentRound % 2 === 0) {
      setUserPackIndex((userPackIndex + 1) % 8);
    } else {
      setUserPackIndex((userPackIndex + 7) % 8); // Move counterclockwise
    }

    // Move to the next round if all packs are empty
    if (updatedPacks[currentRound].every(pack => pack.length === 0)) {
      setCurrentRound(currentRound + 1);
      setUserPackIndex(0); // Reset to the first pack
    }
  };

  const getColorClass = (colors: string[]) => {
    if (colors.length === 0) return 'gray';
    if (colors.length === 1) {
      switch (colors[0]) {
        case 'W': return 'white';
        case 'U': return 'blue';
        case 'B': return 'black';
        case 'R': return 'red';
        case 'G': return 'green';
        default: return 'gray';
      }
    }
    return 'gold'; // Multicolored
  };

  const convertManaCostToSymbols = (manaCost: string) => {
    return manaCost.split('}{').map((symbol, index) => {
      const cleanSymbol = symbol.replace(/[{}]/g, '').toLowerCase();
      return <i key={index} className={`ms ms-${cleanSymbol}`}></i>;
    });
  };

  const parseManaValue = (manaCost: string) => {
    const manaSymbols = manaCost.match(/{[^}]+}/g) || [];
    return manaSymbols.reduce((total, symbol) => {
      const cleanSymbol = symbol.replace(/[{}]/g, '');
      if (!isNaN(Number(cleanSymbol))) {
        return total + Number(cleanSymbol);
      }
      return total + 1;
    }, 0);
  };

  const sortedDeck = [...deck].sort((a, b) => parseManaValue(a.mana_cost) - parseManaValue(b.mana_cost));

  const handleGenerateDeckList = () => {
    const deckListText = deck.map(card => `1 ${card.name}`).join('\n');
    setDeckList(deckListText);
  };

  return (
    <div>
      <h2>Draft</h2>
      {message && <p>{message}</p>}
      <div className="pack">
        {packs[currentRound]?.[userPackIndex]?.map((card, index) => (
          <div key={`${card.id}-${index}`} className="card-container" onClick={() => handleCardSelect(card)}>
            <img
              src={card.image_uris.normal}
              alt={card.name}
              className="card-image"
            />
            <div className="amplified-card">
              <img
                src={card.image_uris.normal}
                alt={card.name}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="deck">
        <h3>Your Deck</h3>
        {sortedDeck.map((card, index) => (
          <div key={`${card.id}-${index}`} className={`deck-card ${getColorClass(card.colors)}`}>
            <span>{card.name}</span>
            <span>{convertManaCostToSymbols(card.mana_cost)}</span>
            <div className="amplified-card">
              <img
                src={card.image_uris.normal}
                alt={card.name}
              />
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleGenerateDeckList}>Generate Deck List</button>
      {deckList && (
        <div>
          <h3>Deck List</h3>
          <textarea value={deckList} readOnly rows={10} cols={50}></textarea>
        </div>
      )}
    </div>
  );
};

export default Draft;