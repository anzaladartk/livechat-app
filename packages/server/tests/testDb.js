const mongoose = require('mongoose');

// Each test file connects in its own beforeAll and disconnects in its own
// afterAll. Jest gives every test file a fresh module registry, so this
// per-file connect/disconnect is what actually prevents Jest from hanging
// after the run finishes (a leaked open connection is the classic cause).
const connectTestDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

const disconnectTestDB = async () => {
  await mongoose.connection.close();
};

module.exports = { connectTestDB, disconnectTestDB };
