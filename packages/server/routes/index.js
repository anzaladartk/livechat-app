const express = require('express');

const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/rooms', require('./roomRoutes'));
router.use('/messages', require('./messageRoutes'));
router.use('/users', require('./userRoutes'));

module.exports = router;
