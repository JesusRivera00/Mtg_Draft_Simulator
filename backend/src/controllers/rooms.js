const axios = require('axios');
const db = require('../models/index');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const createRoom = async (req, res) => {
  const { name, userId } = req.body;
  const trx = await db.transaction();
  try {
    const [roomId] = await trx('rooms').insert({ name }).returning('id');

    const seatData = [];
    for (let i = 0; i < 8; i++) {
      seatData.push({ room_id: roomId, seat_index: i, is_bot: true });
    }
    await trx('room_players').insert(seatData);

    // Automatically join the room
    const botSeat = await trx('room_players')
      .where({ room_id: roomId, is_bot: true })
      .first();

    if (!botSeat) {
      await trx.rollback();
      return res.status(400).json({ error: 'No available bot seats in this room.' });
    }

    await trx('room_players')
      .where({ id: botSeat.id })
      .update({ user_id: userId, is_bot: false });

    const seats = await trx('room_players').where({ room_id: roomId });

    await trx.commit();
    return res.status(201).json({ roomId, seats });
  } catch (error) {
    await trx.rollback();
    return res.status(500).json({ error: error.message });
  }
};

const joinRoom = async (req, res) => {
  const { roomId, userId } = req.body;
  try {
    const botSeat = await db('room_players')
      .where({ room_id: roomId, is_bot: true })
      .first();

    if (!botSeat) {
      return res.status(400).json({ error: 'No available bot seats in this room.' });
    }

    await db('room_players')
      .where({ id: botSeat.id })
      .update({ user_id: userId, is_bot: false });

    const seats = await db('room_players').where({ room_id: roomId });

    return res.status(200).json({ seats });
  } catch (error) {
    console.error('Error joining room:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const startDraft = async (req, res) => {
  const { roomId, setName } = req.body;
  const trx = await db.transaction();
  try {
    console.log(`Starting draft for room ${roomId} with set ${setName}`);
    await trx('rooms').where({ id: roomId }).update({ status: 'drafting', set_name: setName });

    // Fetch packs for the draft
    const response = await axios.post('http://localhost:3000/api/draft/packs', { setName });
    const packs = response.data.packs;

    // Initialize draft state
    const draftState = {
      room_id: roomId,
      packs: JSON.stringify(packs), // Serialize packs to JSON string
      picks: JSON.stringify({}), // Serialize picks to JSON string
      current_round: 0,
      user_pack_index: 0
    };
    console.log('Draft state to be inserted:', draftState);
    await trx('draft_state').insert(draftState);

    console.log(`Draft state created for room ${roomId}`);

    // Commit the transaction
    await trx.commit();

    // Notify all users in the room that the draft has started
    const { error } = await supabase
      .from('rooms')
      .update({ status: 'drafting', set_name: setName })
      .eq('id', roomId);

    if (error) {
      throw error;
    }

    return res.status(200).json({ message: 'Draft started' });
  } catch (error) {
    await trx.rollback();
    console.error('Error starting draft:', error);
    return res.status(500).json({ error: error.message });
  }
};

const checkDraftStatus = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await db('rooms').where({ id: roomId }).first();
    return res.status(200).json({ status: room.status, setName: room.set_name });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getSeats = async (req, res) => {
  const { roomId } = req.params;
  try {
    const seats = await db('room_players').where({ room_id: roomId });
    return res.status(200).json({ seats });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createRoom, joinRoom, startDraft, checkDraftStatus, getSeats };