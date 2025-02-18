const db = require('../models/index');

const saveCards = async (req, res) => {
  const { cards } = req.body;
  try {
    await db('cards').insert(cards.map(card => ({
      name: card.name,
      scryfall_id: card.id,
      data: card
    })));
    res.status(201).json({ message: 'Cards saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { saveCards };