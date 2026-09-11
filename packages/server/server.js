require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const { createSocketServer } = require('./config/socketConfig');

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
const io = createSocketServer(httpServer);

// Makes the shared io instance reachable from REST controllers via req.app.get('io').
app.set('io', io);

// Minimal placeholder — real event handlers get wired up in Phase 6.
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

const start = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
