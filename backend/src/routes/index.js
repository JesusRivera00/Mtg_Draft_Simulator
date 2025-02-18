const express = require('express');
const { signUp, signIn } = require('../controllers/auth');
const { createRoom, joinRoom } = require('../controllers/rooms');
const { saveCards } = require('../controllers/cards');
const { fetchPack } = require('../controllers/draft');

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/rooms', createRoom);
router.post('/rooms/join', joinRoom);
router.post('/cards', saveCards);
router.post('/draft/pack', fetchPack);

module.exports = router;