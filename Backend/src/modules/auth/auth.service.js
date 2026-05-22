import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/user.model.js';
import { sendVerificationEmail } from '../../utils/email.js';
import ApiError from '../../utils/ApiError.js';
import { env } from '../../config/env.js';
import { JWT } from '../../constants/index.js';

/**
 * Register a new user.
 * - Validates uniqueness via Mongoose unique index (throws 11000 → caught by error handler)
 * - Password hashed in pre-save hook (not here)
 * - Sends verification email (non-blocking — failure doesn't abort registration)
 */
export const registerUser = async ({ username, email, password }) => {
  // Create user — password hashing happens in pre-save hook
  // confirmPassword is already stripped by Joi validate() middleware
  const user = await UserModel.create({ username, email, password });

  // Generate email verification token
  const emailToken = jwt.sign({ email: user.email }, env.jwtEmailSecret, {
    expiresIn: JWT.EMAIL_TOKEN_EXPIRES,
  });

  // Send verification email — non-blocking (don't await failure crash)
  sendVerificationEmail(user.email, emailToken);

  // Return user without password (select:false already excludes it)
  return user;
};

/**
 * Login user.
 * - Returns JWT access token on success.
 * - Deliberately uses a vague error message to prevent user enumeration.
 *   (Don't tell attackers whether the email exists or just the password is wrong)
 */
export const loginUser = async ({ email, password }) => {
  // Must use +password because select:false excludes it by default
  const user = await UserModel.findOne({ email }).select('+password');

  // WHY vague message: if we say "email not found", attackers can enumerate valid emails
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isConfirmed) {
    throw ApiError.unauthorized(
      'Please verify your email address before logging in. Check your inbox.'
    );
  }

  // Generate access token
  const token = jwt.sign({ _id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: JWT.ACCESS_TOKEN_EXPIRES,
  });

  // Return token and user info (password excluded via select:false)
  const safeUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return { token, user: safeUser };
};

/**
 * Verify email address using the token from the verification link.
 */
export const verifyEmail = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtEmailSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.badRequest(
        'Verification link has expired. Please register again or request a new link.'
      );
    }
    throw ApiError.badRequest('Invalid verification link.');
  }

  const user = await UserModel.findOneAndUpdate(
    { email: decoded.email, isConfirmed: false },
    { isConfirmed: true },
    { new: true }
  );

  if (!user) {
    // Either email doesn't exist, or already confirmed — both are fine to report
    throw ApiError.badRequest('Account already verified or verification link is invalid.');
  }

  return user;
};
