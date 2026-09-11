const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Assembles the Express app without starting it. Kept separate from server.js
// so tests (Supertest) can import `app` without opening a real port or socket.
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
