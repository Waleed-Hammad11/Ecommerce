import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as userService from './user.service.js';
import { HTTP_STATUS } from '../../constants/index.js';

/**
 * USER CONTROLLER — Admin user management endpoints.
 * All business logic delegated to user.service.js.
 */

/**
 * GET /api/v1/admin/users
 * Get all users with pagination (admin only)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.validatedQuery || req.query;
  const { users, meta } = await userService.getAllUsers({ page, limit });

  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Users retrieved successfully', users, meta));
});

/**
 * GET /api/v1/admin/users/:id
 * Get single user by ID (admin only)
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('User found', user));
});

/**
 * DELETE /api/v1/admin/users/:id
 * Delete a user by ID (admin only)
 */
export const deleteUserById = asyncHandler(async (req, res) => {
  const deleted = await userService.deleteUserById(req.params.id, req.user._id);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('User deleted successfully', deleted));
});

/**
 * GET /api/v1/user/me
 * Get current user's own profile
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  res.status(HTTP_STATUS.OK).json(ApiResponse.success('Profile retrieved', user));
});
