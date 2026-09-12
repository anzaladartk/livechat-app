const express = require('express');
const { list, create, getById, join, leave } = require('../controllers/roomController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate, createRoomValidation } = require('../middleware/validation');

const router = express.Router();

// Public directory listing — no PII exposed, just name/description/memberCount.
// optionalAuth adds `isMember` per room when the caller happens to be logged in.
router.get('/', optionalAuth, list);

router.post('/', protect, createRoomValidation, validate, create);
// Requires login: reveals the members list (name/avatar), not public directory info.
router.get('/:roomId', protect, getById);
router.post('/:roomId/join', protect, join);
router.post('/:roomId/leave', protect, leave);

module.exports = router;
