const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const { connectTestDB, disconnectTestDB } = require('./testDb');

// Unique-per-run prefix so repeated test runs never collide with each other's data.
const runId = Date.now();
const testEmail = (label) => `auth-test-${label}-${runId}@livechat-test.dev`;

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await User.deleteMany({ email: { $regex: `^auth-test-.*-${runId}@livechat-test\\.dev$` } });
  await disconnectTestDB();
});

describe('POST /api/auth/register', () => {
  test('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: testEmail('register-ok'),
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testEmail('register-ok'));
    expect(res.body.user.password).toBeUndefined();
  });

  test('rejects a duplicate email with 409', async () => {
    const email = testEmail('duplicate');
    await request(app).post('/api/auth/register').send({ name: 'First', email, password: 'password123' });

    const res = await request(app).post('/api/auth/register').send({ name: 'Second', email, password: 'password456' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test('rejects a password shorter than 6 characters with 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: testEmail('short-password'),
      password: '123',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  const email = testEmail('login');
  const password = 'password123';

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({ name: 'Login User', email, password });
  });

  test('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(email);
  });

  test('rejects an incorrect password with 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('rejects a non-existent email with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail('never-registered'), password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/auth/verify', () => {
  test('rejects a request with no token', async () => {
    const res = await request(app).get('/api/auth/verify');

    expect(res.status).toBe(401);
  });

  test('returns the user for a valid token', async () => {
    const email = testEmail('verify');
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Verify User', email, password: 'password123' });

    const res = await request(app).get('/api/auth/verify').set('Authorization', `Bearer ${registerRes.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(email);
  });
});
