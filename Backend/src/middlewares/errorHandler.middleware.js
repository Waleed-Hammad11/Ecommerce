import ApiError from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

const handleMongooseValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return ApiError.badRequest('Validation failed', errors);
};

const handleMongooseCastError = (err) => {
  return ApiError.badRequest(`Invalid value for field '${err.path}': ${err.value}`);
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return ApiError.conflict(`${field} '${value}' already exists`);
};

const handleJWTError = () => ApiError.unauthorized('Invalid token. Please log in again.');

const handleJWTExpiredError = () =>
  ApiError.unauthorized('Your token has expired. Please log in again.');

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
    error: err,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors?.length ? err.errors : undefined,
    });
  } else {
    logger.error('UNEXPECTED ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong on our end. Please try again later.',
    });
  }
};

export const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  if (err.statusCode >= 500) {
    logger.error(`${err.statusCode} ${req.method} ${req.originalUrl} - ${err.message}`, {
      stack: err.stack,
    });
  } else {
    logger.warn(`${err.statusCode} ${req.method} ${req.originalUrl} - ${err.message}`);
  }

  let error = err;

  if (err.name === 'ValidationError') error = handleMongooseValidationError(err);
  else if (err.name === 'CastError') error = handleMongooseCastError(err);
  else if (err.code === 11000) error = handleDuplicateKeyError(err);
  else if (err.name === 'JsonWebTokenError') error = handleJWTError();
  else if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (env.isDev) {
    sendDevError(error, res);
  } else {
    sendProdError(error, res);
  }
};
