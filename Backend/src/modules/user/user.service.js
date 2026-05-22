import { UserModel } from '../../models/user.model.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../constants/index.js';

export const getAllUsers = async ({
  page = PAGINATION.DEFAULT_PAGE,
  limit = PAGINATION.DEFAULT_LIMIT,
}) => {
  const skip = (page - 1) * Math.min(limit, PAGINATION.MAX_LIMIT);
  const safeLimit = Math.min(Number(limit), PAGINATION.MAX_LIMIT);

  const [users, total] = await Promise.all([
    UserModel.find()
      .select('-password -passwordChangedAt') // Explicit exclusion — defense in depth
      .skip(skip)
      .limit(safeLimit)
      .lean(), // .lean() for read-only — 2x faster than full Mongoose doc
    UserModel.countDocuments(),
  ]);

  return {
    users,
    meta: {
      total,
      page: Number(page),
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      hasNextPage: Number(page) < Math.ceil(total / safeLimit),
      hasPrevPage: Number(page) > 1,
    },
  };
};

export const getUserById = async (id) => {
  const user = await UserModel.findById(id).select('-password -passwordChangedAt').lean();
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

export const deleteUserById = async (id, requestingUserId) => {
  // WHY: Prevent an admin from deleting themselves accidentally
  if (id === requestingUserId.toString()) {
    throw ApiError.badRequest('You cannot delete your own account');
  }

  const deleted = await UserModel.findByIdAndDelete(id).select('-password').lean();
  if (!deleted) throw ApiError.notFound('User not found');

  return { _id: deleted._id, username: deleted.username, email: deleted.email };
};
