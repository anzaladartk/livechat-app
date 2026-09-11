const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, verify } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, registerValidation, loginValidation } = require('../middleware/validation');

const router = express.Router();

// Prevents brute-forcing login/registration. Skipped in tests so the
// automated test suite doesn't trip its own limiter across repeated runs.
if (process.env.NODE_ENV !== 'test') {
  router.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many attempts, please try again later' },
    })
  );
}

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/verify', protect, verify);

module.exports = router;
