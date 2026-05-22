import { Router } from 'express';
import * as userController from './user.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { isAdmin } from '../../middlewares/authorize.middleware.js';

const router = Router();

/**
 * USER ROUTES
 *
 * Admin routes:   /api/v1/admin/users
 * Profile routes: /api/v1/user/me
 */

// ─── Profile (any authenticated user) ────────────────────────────────────────
router.get('/me', authenticate, userController.getMyProfile);

// ─── Admin user management ─────────────────────────────────────────────────
router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.get('/:id', authenticate, isAdmin, userController.getUserById);
router.delete('/:id', authenticate, isAdmin, userController.deleteUserById);

export default router;
