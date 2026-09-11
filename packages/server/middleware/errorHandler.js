const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  // Mongoose duplicate key error (e.g. email or room name already taken)
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate field value entered' });
  }

  // Mongoose schema validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    return res.status(400).json({ success: false, message });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message || 'Server error' });
};

module.exports = errorHandler;
