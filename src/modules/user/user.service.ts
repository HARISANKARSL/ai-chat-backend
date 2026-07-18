import AppError from "../../common/errors/AppError.js";
import ErrorCodes from "../../common/errors/errorCodes.js";
import ErrorMessages from "../../common/errors/errorMessages.js";
import bcrypt from "bcrypt";
import type { ChangePasswordInput } from "./user.types.js";
import { hashPassword } from "../../common/utils/hash.js";
import {
  deleteUser,
  findById,
  updatePassword,
} from "./user.repository.js";
import {
  findAllUsers,
  findUserById,
  updateUser,
} from "./user.repository.js";
import { UpdateProfileInput } from "./user.types.js";
import { logSecurityEvent } from "../security/security.service.js";
import { SecurityEvent } from "../security/security.constants.js";

export const getAllUsers = async () => {
  return await findAllUsers();
};

export const getUserById = async (
  userId: string
) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError(
      ErrorMessages.USER_NOT_FOUND,
      404,
      ErrorCodes.USER_NOT_FOUND
    );
  }

  return user;
};
export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput
) => {
  const user = await updateUser(
    userId,
    input
  );

  if (!user) {
    throw new AppError(
      ErrorMessages.USER_NOT_FOUND,
      404,
      ErrorCodes.USER_NOT_FOUND
    );
  }

  return user;
};
export const changePassword = async (
  userId: string,
  input: ChangePasswordInput
) => {
  const user = await findById(userId);

  if (!user) {
    throw new AppError(
      ErrorMessages.USER_NOT_FOUND,
      404,
      ErrorCodes.USER_NOT_FOUND
    );
  }

  const isPasswordValid = await bcrypt.compare(
    input.currentPassword,
    user.password
  );

  if (!isPasswordValid) {
    await logSecurityEvent({
      userId,
      event: SecurityEvent.PASSWORD_CHANGED,
      success: false,
      deviceId: "",
      metadata: {
        reason: "INVALID_CURRENT_PASSWORD",
      },
    });

    throw new AppError(
      ErrorMessages.INVALID_CREDENTIALS,
      401,
      ErrorCodes.INVALID_CREDENTIALS
    );
  }

  const hashedPassword = await hashPassword(
    input.newPassword
  );

  await updatePassword(
    userId,
    hashedPassword
  );

  await logSecurityEvent({
    userId,
    event: SecurityEvent.PASSWORD_CHANGED,
    success: true,
    deviceId: "",
    metadata: {
      reason: "PASSWORD_CHANGED",
    },
  });
};

export const deleteMyAccount = async (
  userId: string
) => {
  const user = await deleteUser(userId);

  if (!user) {
    throw new AppError(
      ErrorMessages.USER_NOT_FOUND,
      404,
      ErrorCodes.USER_NOT_FOUND
    );
  }

  await logSecurityEvent({
    userId,
    event: SecurityEvent.DELETE_ACCOUNT,
    success: true,
    deviceId: "",
    metadata: {
      reason: "ACCOUNT_DELETED",
    },
  });
};