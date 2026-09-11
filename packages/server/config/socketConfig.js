const { Server } = require('socket.io');

const createSocketServer = (httpServer) => {
  return new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });
};

module.exports = { createSocketServer };
