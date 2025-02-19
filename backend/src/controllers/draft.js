const axios = require('axios');

const fetchPacks = async (req, res) => {
  const { setName } = req.body;
  console.log('Fetching packs for set:', setName); // Log the set name
  try {
    const response = await axios.get(`https://api.scryfall.com/sets/${setName}`);
    if (!response.data.search_uri) {
      throw new Error('Invalid set name');
    }
    const cardsResponse = await axios.get(response.data.search_uri);
    const cards = cardsResponse.data.data;

    // Function to create a pack
    const createPack = () => {
      const rares = cards.filter(card => card.rarity === 'rare' || card.rarity === 'mythic');
      const uncommons = cards.filter(card => card.rarity === 'uncommon');
      const commons = cards.filter(card => card.rarity === 'common');

      return [
        ...rares.sort(() => 0.5 - Math.random()).slice(0, 1),
        ...uncommons.sort(() => 0.5 - Math.random()).slice(0, 3),
        ...commons.sort(() => 0.5 - Math.random()).slice(0, 10),
      ];
    };

    // Create 3 sets of 8 packs
    const packs = Array.from({ length: 3 }, () => Array.from({ length: 8 }, createPack));

    res.status(200).json({ packs });
  } catch (error) {
    console.error('Error fetching packs:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const draftBots = (pack) => {
  // Select the card with the highest EDH rating
  const selectedCard = pack.reduce((highestRatedCard, currentCard) => {
    return currentCard.edhrec_rank < highestRatedCard.edhrec_rank ? currentCard : highestRatedCard;
  });
  return selectedCard;
};

module.exports = { fetchPacks, draftBots };