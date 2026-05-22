import ApiError from '../utils/ApiError.js';
import { ROLES } from '../constants/index.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required before authorization'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required role: [${roles.join(', ')}]. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};

export const isAdmin = authorize(ROLES.ADMIN);
export const isUser = authorize(ROLES.USER);
export const isAdminOrUser = authorize(ROLES.ADMIN, ROLES.USER);
