import { HTTP_STATUS } from '../constants/index.js';

class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(msg, errors = []) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, msg, errors);
  }

  static unauthorized(msg = 'Unauthorized') {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, msg);
  }

  static forbidden(msg = 'Access denied') {
    return new ApiError(HTTP_STATUS.FORBIDDEN, msg);
  }

  static notFound(msg = 'Resource not found') {
    return new ApiError(HTTP_STATUS.NOT_FOUND, msg);
  }

  static conflict(msg) {
    return new ApiError(HTTP_STATUS.CONFLICT, msg);
  }

  static internal(msg = 'Internal server error') {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, msg);
  }
}

export default ApiError;
