const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validate, profileUpdateValidation } = require('../middleware/validation');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, profileUpdateValidation, validate, updateProfile);

module.exports = router;
