import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import * as productService from './product.service.js';
import { HTTP_STATUS } from '../../constants/index.js';

/**
 * PRODUCT CONTROLLER — Thin HTTP adapter.
 * All business logic in product.service.js.
 */

/**
 * GET /api/v1/products
 * Get all active products with optional pagination and filtering
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  // Use req.validatedQuery — populated by validate(paginationSchema, 'query') middleware
  // Falls back to req.query for requests without validation middleware
  const queryParams = req.validatedQuery || req.query;
  const { products, meta } = await productService.getAllProducts(queryParams);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Products retrieved', products, meta));
});

/**
 * GET /api/v1/products/:id
 * Get a single product by ID
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Product found', product));
});

/**
 * POST /api/v1/admin/products
 * Create a new product (admin only) — optionally with image upload
 */
export const createProduct = asyncHandler(async (req, res) => {
  // Image filename from multer (if uploaded)
  const imageFilename = req.file ? req.file.filename : null;

  const product = await productService.createProduct(req.body, req.user._id, imageFilename);
  res.status(HTTP_STATUS.CREATED).json(ApiResponse.created('Product added successfully', product));
});

/**
 * PUT /api/v1/admin/products/:id
 * Update a product (admin only)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Product updated', product));
});

/**
 * DELETE /api/v1/admin/products/:id
 * Soft-delete a product (admin only)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Product deleted', result));
});

/**
 * POST /api/v1/admin/products/:id/image
 * Upload / replace a product image (admin only)
 */
export const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest(
      'No image file provided. Use multipart/form-data with field name "image"'
    );
  }

  const result = await productService.uploadProductImage(req.params.id, req.file.filename);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Image uploaded successfully', result));
});
