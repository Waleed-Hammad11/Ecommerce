import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as authService from './auth.service.js';
import { HTTP_STATUS } from '../../constants/index.js';

/**
 * POST /api/v1/auth/register
 * Register a new user account
 */
export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);

  res
    .status(HTTP_STATUS.CREATED)
    .json(
      ApiResponse.created(
        'Registration successful! Please check your email to verify your account.',
        { _id: user._id, username: user.username, email: user.email }
      )
    );
});

/**
 * POST /api/v1/auth/login
 * Login with email and password
 */
export const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.loginUser(req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(ApiResponse.success(`Welcome back, ${user.username}!`, { token, user }));
});

/**
 * GET /api/v1/auth/verify-email/:token
 * Verify email address via link sent to email
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.params.token);

  res
    .status(HTTP_STATUS.OK)
    .json(ApiResponse.success('Email verified successfully! You can now log in.'));
});
