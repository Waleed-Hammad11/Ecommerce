/**
 * Application-wide constants.
 * Centralized here to avoid magic strings/numbers scattered across the codebase.
 */

// ─── HTTP Status Codes ───────────────────────────────────────────────────────
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// ─── User Roles ───────────────────────────────────────────────────────────────
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// ─── JWT ─────────────────────────────────────────────────────────────────────
export const JWT = {
  ACCESS_TOKEN_EXPIRES: '7d',
  EMAIL_TOKEN_EXPIRES: '1d', // verification links expire after 1 day
};

// ─── Pagination Defaults ──────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// ─── Multer ───────────────────────────────────────────────────────────────────
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5 MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};
