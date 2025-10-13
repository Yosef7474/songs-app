const express = require('express');
const router = express.Router();
const {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong
} = require('../controllers/songs.controller');

const { getStatistics } = require('../controllers/statistics.controller');

// Song routes
router.post('/songs', createSong);
router.get('/songs', getSongs);
router.get('/songs/:id', getSongById);
router.put('/songs/:id', updateSong);
router.delete('/songs/:id', deleteSong);

// Statistics route
router.get('/statistics', getStatistics);

module.exports = router;