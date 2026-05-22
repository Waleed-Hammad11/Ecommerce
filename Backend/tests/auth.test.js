import request from 'supertest';
import { connectTestDB, disconnectTestDB, clearCollection } from './setup.js';
import { UserModel } from '../src/models/user.model.js';
import app from '../src/app.js';

/**
 * AUTH TESTS
 *
 * Tests all auth flows:
 * - Registration (success, duplicate email, weak password, missing fields)
 * - Email verification
 * - Login (success, wrong password, unconfirmed account)
 */

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearCollection(UserModel);
});

describe('POST /api/v1/auth/register', () => {
  const validUser = {
    username: 'TestUser',
    email: 'test@example.com',
    password: 'SecurePass1',
    confirmPassword: 'SecurePass1',
  };

  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(validUser.email);
    expect(res.body.data.password).toBeUndefined(); // Password never returned
  });

  it('should reject duplicate email', async () => {
    await request(app).post('/api/v1/auth/register').send(validUser);
    const res = await request(app).post('/api/v1/auth/register').send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should reject weak password (no uppercase)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, password: 'nouppercase1', confirmPassword: 'nouppercase1' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should reject mismatched passwords', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, confirmPassword: 'DifferentPass1' });

    expect(res.status).toBe(400);
  });

  it('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should reject invalid email format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, email: 'not-an-email' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    // Create and manually confirm a user for login tests
    const user = await UserModel.create({
      username: 'LoginUser',
      email: 'login@example.com',
      password: 'SecurePass1',
    });
    await UserModel.findByIdAndUpdate(user._id, { isConfirmed: true });
  });

  it('should login with valid credentials and return token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@example.com', password: 'SecurePass1' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@example.com', password: 'WrongPass1' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should reject non-existent email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@example.com', password: 'SecurePass1' });

    // WHY same message: prevents email enumeration
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should reject unconfirmed account', async () => {
    // Create unconfirmed user
    await UserModel.create({
      username: 'UnconfirmedUser',
      email: 'unconfirmed@example.com',
      password: 'SecurePass1',
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'unconfirmed@example.com', password: 'SecurePass1' });

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('verify your email');
  });

  it('should reject NoSQL injection attempt', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: { $gt: '' }, password: { $gt: '' } });

    // mongo-sanitize strips the operators — should be 400 validation error
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/v1/auth/verify-email/:token', () => {
  it('should reject an invalid token', async () => {
    const res = await request(app).get('/api/v1/auth/verify-email/invalid-token');
    expect(res.status).toBe(400);
  });
});
