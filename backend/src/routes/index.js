const express = require('express');
const { signUp, signIn } = require('../controllers/auth');
const { createRoom, joinRoom } = require('../controllers/rooms');

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/rooms', createRoom);
router.post('/rooms/join', joinRoom);

module.exports = router;