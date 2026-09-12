const express = require('express');
const { list } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Message content is private — requires login, unlike the public room directory.
router.get('/:roomId', protect, list);

module.exports = router;
