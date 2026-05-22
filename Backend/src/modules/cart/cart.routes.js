import { Router } from 'express';
import * as cartController from './cart.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { isAdmin } from '../../middlewares/authorize.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { addToCartSchema, updateCartItemSchema } from './cart.validator.js';

const router = Router();

/**
 * CART ROUTES
 *
 * User routes:  /api/v1/cart       (authenticate required)
 * Admin routes: /api/v1/admin/cart (authenticate + isAdmin required)
 */

// ─── User Cart Routes ─────────────────────────────────────────────────────────
router.get('/my-cart', authenticate, cartController.getMyCart);
router.post('/', authenticate, validate(addToCartSchema), cartController.addToCart);
router.put('/', authenticate, validate(updateCartItemSchema), cartController.updateCartItem);
router.delete('/item/:productId', authenticate, cartController.removeCartItem);
router.delete('/', authenticate, cartController.clearCart);

// ─── Admin Cart Routes ────────────────────────────────────────────────────────
router.get('/admin', authenticate, isAdmin, cartController.getAllCarts);
router.get('/admin/:id', authenticate, isAdmin, cartController.getCartById);
router.delete(
  '/admin/:cartId/item/:productId',
  authenticate,
  isAdmin,
  cartController.adminRemoveCartItem
);
router.delete('/admin/:cartId', authenticate, isAdmin, cartController.adminDeleteCart);

export default router;
