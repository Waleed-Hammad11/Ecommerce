import Joi from 'joi';

export const createProductSchema = Joi.object({
  title: Joi.string().min(2).max(200).trim().required().messages({
    'string.min': 'Title must be at least 2 characters',
    'any.required': 'Product title is required',
  }),
  description: Joi.string().max(2000).trim().allow('').optional(),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    'number.min': 'Quantity cannot be negative',
    'any.required': 'Quantity is required',
  }),
});

export const updateProductSchema = Joi.object({
  title: Joi.string().min(2).max(200).trim().optional(),
  description: Joi.string().max(2000).trim().allow('').optional(),
  price: Joi.number().min(0).optional(),
  quantity: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional(),
}).min(1); // At least one field must be provided for an update

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
});
