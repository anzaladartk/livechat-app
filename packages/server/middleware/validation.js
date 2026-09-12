const { body, validationResult } = require('express-validator');

// Runs after an express-validator chain; short-circuits with a 400 if it failed.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name must be 50 characters or fewer'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const createRoomValidation = [
  body('name').trim().notEmpty().withMessage('Room name is required').isLength({ max: 50 }).withMessage('Room name must be 50 characters or fewer'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Description must be 200 characters or fewer'),
];

const profileUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ max: 50 }).withMessage('Name must be 50 characters or fewer'),
  body('avatar').optional().trim().isLength({ max: 500 }).withMessage('Avatar URL is too long'),
];

module.exports = { validate, registerValidation, loginValidation, createRoomValidation, profileUpdateValidation };
