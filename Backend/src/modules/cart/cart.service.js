import { CartModel } from '../../models/cart.model.js';
import { ProductModel } from '../../models/product.model.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../constants/index.js';
import { env } from '../../config/env.js';

// Populate options — consistent across all cart queries
const POPULATE_OPTIONS = [
  {
    path: 'products.productId',
    select: 'title price image isActive',
  },
  {
    path: 'createdBy',
    select: 'username email',
  },
];

const buildImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  return `${env.backendUrl}/uploads/${filename}`;
};

// Format cart for API response — add imageUrls
const formatCart = (cart) => {
  const c = cart.toObject ? cart.toObject({ virtuals: true }) : cart;
  if (c.products) {
    c.products = c.products.map((item) => {
      if (item.productId && item.productId.image) {
        item.productId.imageUrl = buildImageUrl(item.productId.image);
      }
      return item;
    });
  }
  return c;
};

export const getMyCart = async (userId) => {
  const cart = await CartModel.findOne({ createdBy: userId })
    .populate(POPULATE_OPTIONS[0])
    .lean({ virtuals: true });

  if (!cart) throw ApiError.notFound('You have no active cart');
  return cart;
};

export const addToCart = async (userId, productId, quantity) => {
  // 1. Verify product exists and has enough stock
  const product = await ProductModel.findById(productId).lean();
  if (!product || !product.isActive) throw ApiError.notFound('Product not found');
  if (product.quantity < quantity) {
    throw ApiError.badRequest(
      `Insufficient stock. Available: ${product.quantity}, Requested: ${quantity}`
    );
  }

  // 2. Find or create cart
  let cart = await CartModel.findOne({ createdBy: userId });

  if (!cart) {
    cart = await CartModel.create({
      createdBy: userId,
      products: [{ productId, quantity, priceAtTime: product.price }],
    });
  } else {
    const existingItem = cart.products.find((item) => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity, priceAtTime: product.price });
    }

    await cart.save();
  }

  // 3. Return populated cart
  const populatedCart = await CartModel.findById(cart._id)
    .populate(POPULATE_OPTIONS[0])
    .lean({ virtuals: true });

  return formatCart(populatedCart);
};

export const updateCartItem = async (userId, productId, quantity) => {
  const cart = await CartModel.findOne({ createdBy: userId });
  if (!cart) throw ApiError.notFound('Cart not found');

  const item = cart.products.find((item) => item.productId.toString() === productId);
  if (!item) throw ApiError.notFound('Product not found in cart');

  // Check stock again on update
  const product = await ProductModel.findById(productId).lean();
  if (product && product.quantity < quantity) {
    throw ApiError.badRequest(`Insufficient stock. Available: ${product.quantity}`);
  }

  item.quantity = quantity;
  await cart.save();

  const updated = await CartModel.findById(cart._id)
    .populate(POPULATE_OPTIONS[0])
    .lean({ virtuals: true });

  return formatCart(updated);
};

export const removeCartItem = async (userId, productId) => {
  // $pull atomically removes the item — no separate find+save cycle
  const cart = await CartModel.findOneAndUpdate(
    { createdBy: userId },
    { $pull: { products: { productId } } },
    { new: true }
  ).populate(POPULATE_OPTIONS[0]);

  if (!cart) throw ApiError.notFound('Cart not found');
  return formatCart(cart);
};

export const clearCart = async (userId) => {
  const cart = await CartModel.findOneAndDelete({ createdBy: userId }).lean();
  if (!cart) throw ApiError.notFound('Cart not found');
  return { _id: cart._id };
};

// ─── Admin Operations ─────────────────────────────────────────────────────────

export const getAllCarts = async ({ page = 1, limit = 10 } = {}) => {
  const safeLimit = Math.min(Number(limit), PAGINATION.MAX_LIMIT);
  const skip = (Number(page) - 1) * safeLimit;

  const [carts, total] = await Promise.all([
    CartModel.find()
      .populate(POPULATE_OPTIONS[0])
      .populate(POPULATE_OPTIONS[1])
      .skip(skip)
      .limit(safeLimit)
      .lean({ virtuals: true }),
    CartModel.countDocuments(),
  ]);

  return {
    carts: carts.map(formatCart),
    meta: {
      total,
      page: Number(page),
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

export const getCartById = async (cartId) => {
  const cart = await CartModel.findById(cartId)
    .populate(POPULATE_OPTIONS[0])
    .populate(POPULATE_OPTIONS[1])
    .lean({ virtuals: true });

  if (!cart) throw ApiError.notFound('Cart not found');
  return formatCart(cart);
};

export const adminRemoveCartItem = async (cartId, productId) => {
  const cart = await CartModel.findByIdAndUpdate(
    cartId,
    { $pull: { products: { productId } } },
    { new: true }
  ).populate(POPULATE_OPTIONS[0]);

  if (!cart) throw ApiError.notFound('Cart not found');
  return formatCart(cart);
};

export const adminDeleteCart = async (cartId) => {
  const cart = await CartModel.findByIdAndDelete(cartId).lean();
  if (!cart) throw ApiError.notFound('Cart not found');
  return { _id: cart._id };
};
