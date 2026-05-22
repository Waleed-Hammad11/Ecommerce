import { ProductModel } from '../../models/product.model.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../constants/index.js';
import { env } from '../../config/env.js';

// Build full image URL from stored filename
const buildImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  return `${env.backendUrl}/uploads/${filename}`;
};

// Add imageUrl to product object
const formatProduct = (product) => {
  if (!product) return null;
  const p = product.toObject ? product.toObject() : product;
  return { ...p, imageUrl: buildImageUrl(p.image) };
};

export const getAllProducts = async ({
  page = PAGINATION.DEFAULT_PAGE,
  limit = PAGINATION.DEFAULT_LIMIT,
  search,
  minPrice,
  maxPrice,
} = {}) => {
  const safeLimit = Math.min(Number(limit), PAGINATION.MAX_LIMIT);
  const skip = (Number(page) - 1) * safeLimit;

  // Build dynamic query filter
  const filter = { isActive: true };

  if (search) {
    // Text search using the text index on title + description
    filter.$text = { $search: search };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  const [products, total] = await Promise.all([
    ProductModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
    ProductModel.countDocuments(filter),
  ]);

  return {
    products: products.map((p) => ({ ...p, imageUrl: buildImageUrl(p.image) })),
    meta: {
      total,
      page: Number(page),
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      hasNextPage: Number(page) < Math.ceil(total / safeLimit),
      hasPrevPage: Number(page) > 1,
    },
  };
};

export const getProductById = async (id) => {
  const product = await ProductModel.findById(id).lean();
  if (!product || !product.isActive) throw ApiError.notFound('Product not found');
  return { ...product, imageUrl: buildImageUrl(product.image) };
};

export const createProduct = async (
  { title, description, price, quantity },
  adminId,
  imageFilename
) => {
  // WHY explicit fields: prevents mass assignment of createdBy, isActive, etc.
  const product = await ProductModel.create({
    title,
    description,
    price,
    quantity,
    image: imageFilename || null,
    createdBy: adminId,
  });

  return formatProduct(product);
};

export const updateProduct = async (id, updates) => {
  // Whitelist allowed update fields — prevents mass assignment
  const allowedUpdates = ['title', 'description', 'price', 'quantity', 'isActive', 'image'];
  const filteredUpdates = Object.keys(updates)
    .filter((key) => allowedUpdates.includes(key))
    .reduce((obj, key) => ({ ...obj, [key]: updates[key] }), {});

  const updated = await ProductModel.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true, // WHY: ensures Mongoose schema validators run on update too
  }).lean();

  if (!updated) throw ApiError.notFound('Product not found');
  return { ...updated, imageUrl: buildImageUrl(updated.image) };
};

export const deleteProduct = async (id) => {
  // Soft delete — preserves data for auditing / cart recovery
  const deleted = await ProductModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).lean();

  if (!deleted) throw ApiError.notFound('Product not found');
  return { _id: deleted._id, title: deleted.title };
};

export const uploadProductImage = async (productId, filename) => {
  const updated = await ProductModel.findByIdAndUpdate(
    productId,
    { image: filename },
    { new: true }
  ).lean();

  if (!updated) throw ApiError.notFound('Product not found');
  return { imageUrl: buildImageUrl(filename) };
};
