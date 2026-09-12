const jwt = require('jsonwebtoken');
const User = require('../models/User');
const registerRoomEvents = require('./events/roomEvents');
const registerMessageEvents = require('./events/messageEvents');
const registerUserEvents = require('./events/userEvents');

const configureSocket = (io) => {
  // Mirrors middleware/auth.js's protect, but for the handshake instead of
  // an HTTP header. sendMessage/typing then trust socket.userId, never a
  // client-supplied field.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      socket.userId = jwt.verify(token, process.env.JWT_SECRET).id;
      next();
    } catch (error) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    // Event listeners must be attached synchronously, before any await —
    // a client can (and does) emit joinRoom the instant it sees 'connect',
    // and Socket.IO drops events with no listener yet rather than buffering
    // them. Awaiting the "mark online" write first would create exactly
    // that race.
    registerRoomEvents(io, socket);
    registerMessageEvents(io, socket);
    registerUserEvents(io, socket);

    User.findByIdAndUpdate(socket.userId, { status: 'online' }).catch((error) => {
      console.error('Failed to mark user online:', error.message);
    });

    socket.on('disconnect', () => {
      User.findByIdAndUpdate(socket.userId, { status: 'offline', lastSeen: new Date() }).catch((error) => {
        console.error('Failed to mark user offline:', error.message);
      });
    });
  });
};

module.exports = configureSocket;
