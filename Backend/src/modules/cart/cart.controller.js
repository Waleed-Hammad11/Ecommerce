import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as cartService from './cart.service.js';
import { HTTP_STATUS } from '../../constants/index.js';

/**
 * CART CONTROLLER — Thin HTTP adapter.
 * All business logic in cart.service.js.
 */

// ─── User Operations ──────────────────────────────────────────────────────────

/** GET /api/v1/cart/my-cart */
export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getMyCart(req.user._id);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Cart retrieved', cart));
});

/** POST /api/v1/cart */
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user._id, productId, quantity);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Item added to cart', cart));
});

/** PUT /api/v1/cart */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user._id, productId, quantity);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Cart item updated', cart));
});

/** DELETE /api/v1/cart/item/:productId */
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCartItem(req.user._id, req.params.productId);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Item removed from cart', cart));
});

/** DELETE /api/v1/cart */
export const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user._id);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Cart cleared successfully'));
});

// ─── Admin Operations ──────────────────────────────────────────────────────────

/** GET /api/v1/cart/admin */
export const getAllCarts = asyncHandler(async (req, res) => {
  const { carts, meta } = await cartService.getAllCarts(req.query || {});
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('All carts', carts, meta));
});

/** GET /api/v1/admin/carts/:id */
export const getCartById = asyncHandler(async (req, res) => {
  const cart = await cartService.getCartById(req.params.id);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Cart found', cart));
});

/** DELETE /api/v1/admin/carts/:cartId/item/:productId */
export const adminRemoveCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.adminRemoveCartItem(req.params.cartId, req.params.productId);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Item removed from cart', cart));
});

/** DELETE /api/v1/admin/carts/:cartId */
export const adminDeleteCart = asyncHandler(async (req, res) => {
  await cartService.adminDeleteCart(req.params.cartId);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Cart deleted'));
});
