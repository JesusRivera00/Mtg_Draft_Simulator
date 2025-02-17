const db = require('../models/index');

const createRoom = async (req, res) => {
  const { name } = req.body;
  try {
    const [roomId] = await db('rooms').insert({ name }).returning('id');
    res.status(201).json({ roomId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const joinRoom = async (req, res) => {
  const { roomId } = req.body;
  try {
    const room = await db('rooms').where({ id: roomId }).first();
    if (room) {
      res.status(200).json({ room });
    } else {
      res.status(404).json({ error: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createRoom, joinRoom };