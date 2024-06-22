const express = require('express');
const voteController = require('../controllers/voteController');

const router = express.Router();

router.post('/vote', voteController.submitVote);
router.get('/vote-status/:userId', voteController.getVoteStatus);
router.get('/votes', voteController.getVotes);

module.exports = router;
