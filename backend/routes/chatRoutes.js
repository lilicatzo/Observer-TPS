const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/chat', chatController.chat);

module.exports = router;
