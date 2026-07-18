import bcrypt from "bcrypt";
import crypto from "crypto";

import AppError from "../../common/errors/AppError.js";
import ErrorCodes from "../../common/errors/errorCodes.js";
import ErrorMessages from "../../common/errors/errorMessages.js";

import { hashPassword } from "../../common/utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.js";
import { hashToken } from "../../common/utils/token.js";

import { redisService } from "../../common/redis/service.js";
import { redisKeys } from "../../common/redis/keys.js";

import {
  findByEmail,
  createUser,
  findById,
} from "../user/user.repository.js";

import {
  logSecurityEvent,
} from "../security/security.service.js";

import { SecurityEvent } from "../security/security.constants.js";

import type {
  LoginInput,
  LogoutInput,
  RefreshTokenInput,
  RegisterInput,
} from "./auth.types.js";

import type { RequestInfo } from "../../types/request-info.js";


// ==========================
// REGISTER
// ==========================

export const registerUser = async (
  input: RegisterInput,
  requestInfo: RequestInfo
) => {
  const existingUser = await findByEmail(input.email);

  if (existingUser) {
    await logSecurityEvent({
      event: SecurityEvent.REGISTER,
      success: false,
      ip: requestInfo.ip ?? "",
      userAgent: requestInfo.userAgent ?? "",
      deviceId: "",
      metadata: {
        email: input.email,
        reason: "EMAIL_ALREADY_EXISTS",
      },
    });

    throw new AppError(
      ErrorMessages.EMAIL_ALREADY_EXISTS,
      409,
      ErrorCodes.EMAIL_ALREADY_EXISTS
    );
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await createUser({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  await logSecurityEvent({
    userId: user.id,
    event: SecurityEvent.REGISTER,
    success: true,
    ip: requestInfo.ip ?? "",
    userAgent: requestInfo.userAgent ?? "",
    deviceId: "",
    metadata: {
      email: user.email,
      reason: "USER_CREATED",
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};


// ==========================
// LOGIN
// ==========================

export const loginUser = async (
  input: LoginInput,
  requestInfo: RequestInfo
) => {
  const user = await findByEmail(input.email);

  if (!user) {
    await logSecurityEvent({
      event: SecurityEvent.LOGIN_FAILED,
      success: false,
      ip: requestInfo.ip ?? "",
      userAgent: requestInfo.userAgent ?? "",
      deviceId: "",
      metadata: {
        email: input.email,
        reason: "USER_NOT_FOUND",
      },
    });

    throw new AppError(
      ErrorMessages.INVALID_CREDENTIALS,
      401,
      ErrorCodes.INVALID_CREDENTIALS
    );
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.password
  );

  if (!isPasswordValid) {
    await logSecurityEvent({
      userId: user.id,
      event: SecurityEvent.LOGIN_FAILED,
      success: false,
      ip: requestInfo.ip ?? "",
      userAgent: requestInfo.userAgent ?? "",
      deviceId: "",
      metadata: {
        email: user.email,
        reason: "INVALID_PASSWORD",
      },
    });

    throw new AppError(
      ErrorMessages.INVALID_CREDENTIALS,
      401,
      ErrorCodes.INVALID_CREDENTIALS
    );
  }

  const accessToken = generateAccessToken(user.id);

  const refreshToken = generateRefreshToken(user.id);

  const deviceId = crypto.randomUUID();

  const hashedRefreshToken = hashToken(refreshToken);

  await redisService.set(
    redisKeys.refreshToken(user.id, deviceId),
    hashedRefreshToken,
    60 * 60 * 24 * 30
  );

  await logSecurityEvent({
    userId: user.id,
    event: SecurityEvent.LOGIN_SUCCESS,
    success: true,
    ip: requestInfo.ip ?? "",
    userAgent: requestInfo.userAgent ?? "",
    deviceId,
    metadata: {
      email: user.email,
      reason: "LOGIN_SUCCESS",
    },
  });

  return {
    accessToken,
    refreshToken,
    deviceId,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};


// ==========================
// REFRESH TOKEN
// ==========================

export const refreshToken = async (
  input: RefreshTokenInput
) => {
  const payload = verifyRefreshToken(
    input.refreshToken
  );

  const redisKey = redisKeys.refreshToken(
    payload.userId,
    input.deviceId
  );

  const storedHash = await redisService.get(redisKey);

  if (!storedHash) {
    throw new AppError(
      ErrorMessages.INVALID_REFRESH_TOKEN,
      401,
      ErrorCodes.INVALID_REFRESH_TOKEN
    );
  }

  const incomingHash = hashToken(
    input.refreshToken
  );

  if (storedHash !== incomingHash) {
    await redisService.deleteByPattern(
      `refresh:${payload.userId}:*`
    );

    await logSecurityEvent({
      userId: payload.userId,
      event: SecurityEvent.TOKEN_REUSE,
      success: false,
      deviceId: input.deviceId,
      metadata: {
        reason: "REFRESH_TOKEN_REUSE_DETECTED",
      },
    });

    throw new AppError(
      ErrorMessages.TOKEN_REUSE_DETECTED,
      401,
      ErrorCodes.TOKEN_REUSE_DETECTED
    );
  }

  const accessToken = generateAccessToken(
    payload.userId
  );

  const newRefreshToken = generateRefreshToken(
    payload.userId
  );

  const newRefreshHash =
    hashToken(newRefreshToken);

  await redisService.set(
    redisKey,
    newRefreshHash,
    60 * 60 * 24 * 30
  );

  await logSecurityEvent({
    userId: payload.userId,
    event: SecurityEvent.TOKEN_REFRESH,
    success: true,
    deviceId: input.deviceId,
    metadata: {
      reason: "TOKEN_REFRESHED",
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    deviceId: input.deviceId,
  };
};


// ==========================
// LOGOUT
// ==========================

export const logoutUser = async (
  userId: string,
  input: LogoutInput
): Promise<void> => {

  const redisKey = redisKeys.refreshToken(
    userId,
    input.deviceId
  );

  await redisService.delete(redisKey);

  await logSecurityEvent({
    userId,
    event: SecurityEvent.LOGOUT,
    success: true,
    deviceId: input.deviceId,
    metadata: {
      reason: "LOGOUT_SUCCESS",
    },
  });
};


// ==========================
// LOGOUT ALL
// ==========================

export const logoutAllDevices = async (
  userId: string
): Promise<void> => {

  const deleted =
    await redisService.deleteByPattern(
      `refresh:${userId}:*`
    );

  if (deleted === 0) {
    throw new AppError(
      ErrorMessages.SESSION_EXPIRED,
      401,
      ErrorCodes.SESSION_EXPIRED
    );
  }

  await logSecurityEvent({
    userId,
    event: SecurityEvent.LOGOUT_ALL,
    success: true,
    deviceId: "",
    metadata: {
      reason: "LOGOUT_ALL_DEVICES",
    },
  });
};


// ==========================
// CURRENT USER
// ==========================

export const getCurrentUser = async (
  userId: string
) => {

  const user = await findById(userId);

  if (!user) {
    throw new AppError(
      ErrorMessages.USER_NOT_FOUND,
      404,
      ErrorCodes.USER_NOT_FOUND
    );
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};