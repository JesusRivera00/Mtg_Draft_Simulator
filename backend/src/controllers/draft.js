const axios = require('axios');

const fetchPack = async (req, res) => {
  const { setName } = req.body;
  console.log('Fetching pack for set:', setName); // Log the set name
  try {
    const response = await axios.get(`https://api.scryfall.com/sets/${setName}`);
    if (!response.data.search_uri) {
      throw new Error('Invalid set name');
    }
    const cardsResponse = await axios.get(response.data.search_uri);
    const cards = cardsResponse.data.data;

    // Randomly select 1 rare or mythic, 3 uncommons, and 10 commons
    const rares = cards.filter(card => card.rarity === 'rare' || card.rarity === 'mythic');
    const uncommons = cards.filter(card => card.rarity === 'uncommon');
    const commons = cards.filter(card => card.rarity === 'common');

    const pack = [
      ...rares.sort(() => 0.5 - Math.random()).slice(0, 1),
      ...uncommons.sort(() => 0.5 - Math.random()).slice(0, 3),
      ...commons.sort(() => 0.5 - Math.random()).slice(0, 10),
    ];

    res.status(200).json({ pack });
  } catch (error) {
    console.error('Error fetching pack:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { fetchPack };