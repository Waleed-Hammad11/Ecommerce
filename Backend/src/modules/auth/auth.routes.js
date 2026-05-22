import { Router } from 'express';
import * as authController from './auth.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from './auth.validator.js';
import rateLimit from 'express-rate-limit';

import { env } from '../../config/env.js';

const router = Router();

// Rate limiting for auth endpoints (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many attempts from this IP. Please try again in 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  skip: () => env.isTest,
});

// POST /api/v1/auth/register
router.post('/register', authLimiter, validate(registerSchema), authController.register);

// POST /api/v1/auth/login
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// GET /api/v1/auth/verify-email/:token
// No rate limit here — the link is already token-protected
router.get('/verify-email/:token', authController.verifyEmail);

export default router;
