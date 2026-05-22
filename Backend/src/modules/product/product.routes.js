import { Router } from 'express';
import * as productController from './product.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { isAdmin } from '../../middlewares/authorize.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { uploadSingle } from '../../middlewares/multer.middleware.js';
import { createProductSchema, updateProductSchema, paginationSchema } from './product.validator.js';

const router = Router();

// Product routes (Public and Admin management)

// ─── Public Routes (no authentication required) ───────────────────────────────
router.get('/', validate(paginationSchema, 'query'), productController.getAllProducts);
router.get('/:id', productController.getProductById);

// ─── Admin-only Routes ────────────────────────────────────────────────────────
// Single file upload: upload.single('image') is applied BEFORE validation
// because Multer must parse multipart/form-data before req.body is accessible
router.post(
  '/',
  authenticate,
  isAdmin,
  uploadSingle, // Parse multipart first
  validate(createProductSchema),
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  isAdmin,
  validate(updateProductSchema),
  productController.updateProduct
);

router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);

// Separate image upload endpoint — allows updating image independently
router.post(
  '/:id/image',
  authenticate,
  isAdmin,
  uploadSingle,
  productController.uploadProductImage
);

export default router;
