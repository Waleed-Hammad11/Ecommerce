import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from '../utils/ApiError.js';
import { UPLOAD } from '../constants/index.js';

const UPLOADS_DIR = 'uploads';

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const isAllowedMime = UPLOAD.ALLOWED_TYPES.includes(file.mimetype);
  const isAllowedExt = /\.(jpg|jpeg|png|webp|gif)$/i.test(file.originalname);

  if (isAllowedMime && isAllowedExt) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        `Invalid file type: ${file.mimetype}. Only JPEG, PNG, WebP, and GIF are allowed.`
      ),
      false
    );
  }
};

const multerConfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE,
    files: UPLOAD.MAX_FILES,
  },
});

export const uploadSingle = multerConfig.single('image');
export const uploadMultiple = multerConfig.array('images', UPLOAD.MAX_FILES);

export const handleMulterError = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          ApiError.badRequest(
            `File too large. Maximum size is ${UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB`
          )
        );
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return next(ApiError.badRequest(`Too many files. Maximum is ${UPLOAD.MAX_FILES} files`));
      }
      return next(ApiError.badRequest(err.message));
    }

    next(err);
  });
};
