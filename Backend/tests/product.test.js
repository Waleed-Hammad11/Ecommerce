import request from 'supertest';
import jwt from 'jsonwebtoken';
import { connectTestDB, disconnectTestDB, clearCollection } from './setup.js';
import { ProductModel } from '../src/models/product.model.js';
import { UserModel } from '../src/models/user.model.js';
import app from '../src/app.js';

/**
 * PRODUCT TESTS
 *
 * Tests product CRUD operations with proper auth.
 * Uses a real admin JWT token for protected routes.
 */

let adminToken;
let adminUserId;

beforeAll(async () => {
  await connectTestDB();

  // Create a test admin user
  const admin = await UserModel.create({
    username: 'AdminUser',
    email: 'admin@test.com',
    password: 'AdminPass1',
    role: 'admin',
    isConfirmed: true,
  });
  adminUserId = admin._id;

  // Generate a valid admin token
  adminToken = jwt.sign(
    { _id: admin._id, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await disconnectTestDB();
});

afterEach(async () => {
  await clearCollection(ProductModel);
});

const validProduct = {
  title: 'Test Product',
  description: 'A test product description',
  price: 99.99,
  quantity: 10,
};

describe('GET /api/v1/products', () => {
  it('should return empty products list (public route, no auth)', async () => {
    const res = await request(app).get('/api/v1/products');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.total).toBe(0);
  });

  it('should return paginated products', async () => {
    // Create 15 products
    const products = Array.from({ length: 15 }, (_, i) => ({
      ...validProduct,
      title: `Product ${i + 1}`,
      createdBy: adminUserId,
    }));
    await ProductModel.insertMany(products);

    const res = await request(app).get('/api/v1/products?page=1&limit=10');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(10);
    expect(res.body.meta.total).toBe(15);
    expect(res.body.meta.totalPages).toBe(2);
    expect(res.body.meta.hasNextPage).toBe(true);
  });

  it('should cap limit at 100', async () => {
    const res = await request(app).get('/api/v1/products?limit=999');
    expect(res.status).toBe(400); // Joi validates max 100
  });
});

describe('POST /api/v1/products (admin)', () => {
  it('should create a product with valid admin token', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validProduct);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(validProduct.title);
    expect(res.body.data.imageUrl).toBeDefined();
  });

  it('should reject product creation without auth', async () => {
    const res = await request(app).post('/api/v1/products').send(validProduct);
    expect(res.status).toBe(401);
  });

  it('should reject product with negative price', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...validProduct, price: -10 });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should reject product with missing title', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 10, quantity: 5 });

    expect(res.status).toBe(400);
  });

  it('should strip unknown fields (mass assignment protection)', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...validProduct, createdBy: 'hacker-id', isActive: false, _id: 'fake-id' });

    // Should succeed but the extra fields should be ignored
    expect(res.status).toBe(201);
    expect(res.body.data._id).not.toBe('fake-id');
  });
});

describe('PUT /api/v1/products/:id (admin)', () => {
  let productId;

  beforeEach(async () => {
    const product = await ProductModel.create({ ...validProduct, createdBy: adminUserId });
    productId = product._id;
  });

  it('should update a product', async () => {
    const res = await request(app)
      .put(`/api/v1/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 149.99 });

    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(149.99);
  });

  it('should return 404 for non-existent product', async () => {
    const res = await request(app)
      .put('/api/v1/products/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 10 });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/v1/products/:id (admin)', () => {
  it('should soft-delete a product', async () => {
    const product = await ProductModel.create({ ...validProduct, createdBy: adminUserId });

    const res = await request(app)
      .delete(`/api/v1/products/${product._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

    // Product should still exist but be inactive
    const dbProduct = await ProductModel.findById(product._id);
    expect(dbProduct.isActive).toBe(false);
  });
});
