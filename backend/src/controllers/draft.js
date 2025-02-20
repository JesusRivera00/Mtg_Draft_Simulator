const axios = require('axios');
const db = require('../models/index');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    console.log('Packs created:', packs);

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

const handleDraftPick = async (req, res) => {
  const { roomId, userId, selectedCard } = req.body;
  try {
    const draftState = await db('draft_state').where({ room_id: roomId }).first();
    const packs = JSON.parse(draftState.packs);
    const picks = JSON.parse(draftState.picks);

    // Update the packs and picks
    const updatedPacks = packs.map((round, roundIndex) => {
      if (roundIndex === draftState.current_round) {
        return round.map((pack, packIndex) => {
          if (packIndex === draftState.user_pack_index) {
            return pack.filter(card => card.id !== selectedCard.id);
          }
          return pack;
        });
      }
      return round;
    });

    picks[userId] = selectedCard;

    // Check if all users have made their picks
    const allPicksMade = Object.keys(picks).length === 8;
    if (allPicksMade) {
      for (let i = 0; i < 7; i++) {
        const botPackIndex = (draftState.user_pack_index + i + 1) % 8;
        const botSelectedCard = draftBots(updatedPacks[draftState.current_round][botPackIndex]);
        updatedPacks[draftState.current_round][botPackIndex] = updatedPacks[draftState.current_round][botPackIndex].filter(card => card.id !== botSelectedCard.id);
      }

      draftState.current_round += 1;
      draftState.user_pack_index = 0;
      draftState.picks = {};
    } else {
      draftState.user_pack_index = (draftState.user_pack_index + 1) % 8;
    }

    // Update the draft state in the database
    await db('draft_state').where({ room_id: roomId }).update({
      packs: JSON.stringify(updatedPacks), 
      picks: JSON.stringify(draftState.picks), 
      current_round: draftState.current_round,
      user_pack_index: draftState.user_pack_index
    });

    // Notify all users in the room about the updated draft state
    const { error } = await supabase
      .from('draft_state')
      .update({
        packs: updatedPacks,
        picks: draftState.picks,
        current_round: draftState.current_round,
        user_pack_index: draftState.user_pack_index
      })
      .eq('room_id', roomId);

    if (error) {
      throw error;
    }

    return res.status(200).json({ message: 'Draft pick updated' });
  } catch (error) {
    console.error('Error handling draft pick:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getDraftState = async (req, res) => {
  const { roomId } = req.params;
  try {
    console.log(`Fetching draft state for room ${roomId}`);
    const draftState = await db('draft_state').where({ room_id: roomId }).first();
    if (!draftState) {
      console.log(`Draft state not found for room ${roomId}`);
      return res.status(404).json({ error: 'Draft state not found' });
    }
    console.log(`Draft state before parsing:`, draftState);
    console.log(`Draft state fetched for room ${roomId}`);
    return res.status(200).json(draftState);
  } catch (error) {
    console.error('Error fetching draft state:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const updateDraftState = async (req, res) => {
  const { roomId } = req.params;
  const { packs, picks } = req.body;
  try {
    await db('draft_state').where({ room_id: roomId }).update({
      packs: JSON.stringify(packs), // Serialize packs to JSON string
      picks: JSON.stringify(picks) // Serialize picks to JSON string
    });
    return res.status(200).json({ message: 'Draft state updated' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { fetchPacks, draftBots, handleDraftPick, getDraftState, updateDraftState };