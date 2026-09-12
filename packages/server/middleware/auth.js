const jwt = require('jsonwebtoken');

// Verifies the "Authorization: Bearer <token>" header and attaches req.userId.
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Like protect, but never rejects — attaches req.userId only when a valid
// token is present. For routes that stay public but add extra per-viewer
// context when the caller happens to be logged in (e.g. "am I a member of
// this room" on the public room directory).
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      req.userId = jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (error) {
      // Invalid/expired token on an optional-auth route: treat as anonymous.
    }
  }

  next();
};

module.exports = { protect, optionalAuth };
