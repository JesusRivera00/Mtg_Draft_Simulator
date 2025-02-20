const express = require('express');
const { signUp, signIn } = require('../controllers/auth');
const { createRoom, joinRoom, startDraft, checkDraftStatus, getSeats } = require('../controllers/rooms');
const { saveCards } = require('../controllers/cards');
const { fetchPacks, handleDraftPick } = require('../controllers/draft');
const { getSets } = require('../controllers/sets');
const { getDraftState, updateDraftState } = require('../controllers/draft');

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/rooms', createRoom);
router.post('/rooms/join', joinRoom);
router.post('/rooms/start', startDraft);
router.get('/rooms/:roomId/status', checkDraftStatus);
router.get('/rooms/:roomId/seats', getSeats);
router.post('/cards', saveCards);
router.post('/draft/packs', fetchPacks);
router.post('/draft/pick', handleDraftPick);
router.get('/sets', getSets);
router.get('/draft/state/:roomId', getDraftState);
router.post('/draft/state/:roomId', updateDraftState);

module.exports = router;