import request from 'supertest';
import jwt from 'jsonwebtoken';
import { connectTestDB, disconnectTestDB, clearCollection } from './setup.js';
import { CartModel } from '../src/models/cart.model.js';
import { ProductModel } from '../src/models/product.model.js';
import { UserModel } from '../src/models/user.model.js';
import app from '../src/app.js';

/**
 * CART TESTS
 *
 * Tests cart operations: add, view, update, delete, admin operations.
 */

let userToken;
let adminToken;
let userId;
let adminId;
let productId;

beforeAll(async () => {
  await connectTestDB();

  const user = await UserModel.create({
    username: 'CartUser',
    email: 'cartuser@test.com',
    password: 'UserPass1',
    role: 'user',
    isConfirmed: true,
  });
  userId = user._id;
  userToken = jwt.sign({ _id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const admin = await UserModel.create({
    username: 'CartAdmin',
    email: 'cartadmin@test.com',
    password: 'AdminPass1',
    role: 'admin',
    isConfirmed: true,
  });
  adminId = admin._id;
  adminToken = jwt.sign({ _id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const product = await ProductModel.create({
    title: 'Cart Test Product',
    price: 25.00,
    quantity: 100,
    createdBy: adminId,
  });
  productId = product._id.toString();
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearCollection(CartModel);
});

describe('POST /api/v1/cart (add to cart)', () => {
  it('should add a product to cart', async () => {
    const res = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products.length).toBe(1);
    expect(res.body.data.products[0].quantity).toBe(2);
  });

  it('should increment quantity if product already in cart', async () => {
    await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, quantity: 2 });

    const res = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, quantity: 3 });

    expect(res.status).toBe(200);
    expect(res.body.data.products[0].quantity).toBe(5);
  });

  it('should reject quantity of 0', async () => {
    const res = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, quantity: 0 });

    expect(res.status).toBe(400);
  });

  it('should reject without authentication', async () => {
    const res = await request(app)
      .post('/api/v1/cart')
      .send({ productId, quantity: 1 });

    expect(res.status).toBe(401);
  });

  it('should reject non-existent product', async () => {
    const res = await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId: '507f1f77bcf86cd799439011', quantity: 1 });

    expect(res.status).toBe(404);
  });
});

describe('GET /api/v1/cart/my-cart', () => {
  it('should return 404 when cart does not exist', async () => {
    const res = await request(app)
      .get('/api/v1/cart/my-cart')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(404);
  });

  it('should return the user cart with populated products', async () => {
    await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, quantity: 1 });

    const res = await request(app)
      .get('/api/v1/cart/my-cart')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.products[0].productId.title).toBeDefined();
  });
});

describe('DELETE /api/v1/cart (clear cart)', () => {
  it('should clear the user cart', async () => {
    await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, quantity: 1 });

    const res = await request(app)
      .delete('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);

    const cartInDb = await CartModel.findOne({ createdBy: userId });
    expect(cartInDb).toBeNull();
  });
});

describe('Admin cart routes', () => {
  it('GET /api/v1/cart/admin should return all carts (admin only)', async () => {
    // Add a cart first
    await request(app)
      .post('/api/v1/cart')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ productId, quantity: 1 });

    const res = await request(app)
      .get('/api/v1/cart/admin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.meta).toBeDefined();
  });

  it('should reject non-admin from admin cart routes', async () => {
    const res = await request(app)
      .get('/api/v1/cart/admin')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});
