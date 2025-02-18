const express = require('express');
const { signUp, signIn } = require('../controllers/auth');
const { createRoom, joinRoom } = require('../controllers/rooms');
const { saveCards } = require('../controllers/cards');
const { fetchPacks } = require('../controllers/draft');

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/rooms', createRoom);
router.post('/rooms/join', joinRoom);
router.post('/cards', saveCards);
router.post('/draft/packs', fetchPacks);

module.exports = router;