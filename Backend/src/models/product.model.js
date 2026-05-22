import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description must not exceed 2000 characters'],
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product must have a creator'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
productSchema.index({ createdBy: 1, createdAt: -1 });
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ isActive: 1, createdAt: -1 });

// Virtual: imageUrl
productSchema.virtual('imageUrl').get(function () {
  if (!this.image) return null;
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
  return `${baseUrl}/uploads/${this.image}`;
});

export const ProductModel = model('Product', productSchema);
