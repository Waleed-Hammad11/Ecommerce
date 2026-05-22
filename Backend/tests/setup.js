/**
 * TEST SETUP
 *
 * Uses a real MongoDB connection (to your local MongoDB).
 * Each test suite connects before and disconnects after.
 *
 * WHY real MongoDB vs in-memory:
 * - mongodb-memory-server has ES module compatibility issues with this project.
 * - Using a dedicated test database (halfEcommerce_test) is reliable and simple.
 * - Tests clean up after themselves using afterEach/afterAll hooks.
 */

import mongoose from 'mongoose';

// Load env before anything else
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://localhost:27017/halfEcommerce_test';
process.env.JWT_SECRET = 'test_jwt_secret_must_be_at_least_32_chars_long';
process.env.JWT_EMAIL_SECRET = 'test_email_secret_must_be_32_chars_min!';
process.env.BACKEND_URL = 'http://localhost:3000';
process.env.FRONTEND_URL = 'http://localhost:4200';
process.env.SMTP_USER = 'test@example.com';
process.env.SMTP_PASS = 'testpassword';

// Connect before all tests in a suite
export const connectTestDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

// Disconnect after all tests in a suite
export const disconnectTestDB = async () => {
  await mongoose.connection.dropDatabase(); // Clean test DB
  await mongoose.connection.close();
};

// Clear a specific collection between tests
export const clearCollection = async (Model) => {
  await Model.deleteMany({});
};
