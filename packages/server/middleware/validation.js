const { validationResult } = require('express-validator');

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

module.exports = { validate };
