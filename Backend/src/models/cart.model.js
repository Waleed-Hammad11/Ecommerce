import { Schema, model } from 'mongoose';

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    priceAtTime: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: true }
);

const cartSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Cart must belong to a user'],
      unique: true,
    },
    products: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: totalPrice
cartSchema.virtual('totalPrice').get(function () {
  return this.products.reduce((total, item) => {
    return total + item.priceAtTime * item.quantity;
  }, 0);
});

// Virtual: itemCount
cartSchema.virtual('itemCount').get(function () {
  return this.products.reduce((count, item) => count + item.quantity, 0);
});

export const CartModel = model('Cart', cartSchema);
