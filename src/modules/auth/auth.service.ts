import AppError from "../../common/errors/AppError.js";
import ErrorCodes from "../../common/errors/errorCodes.js";
import ErrorMessages from "../../common/errors/errorMessages.js";
import { hashPassword } from "../../common/utils/hash.js";
import bcrypt from "bcrypt";
import {
  findByEmail,
  createUser,
  findById,
} from "../user/user.repository.js";

import type { LoginInput, LogoutInput, RefreshTokenInput, RegisterInput } from "./auth.types.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../common/utils/jwt.js";
import { redisService } from "../../common/redis/service.js";
import { redisKeys } from "../../common/redis/keys.js";
import { hashToken } from "../../common/utils/token.js";

export const registerUser = async (
  input: RegisterInput
) => {
  const existingUser = await findByEmail(input.email);

  if (existingUser) {
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
      password: hashedPassword
    
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};


export const loginUser = async (
  input: LoginInput
) => {
  // Find User
  const user = await findByEmail(input.email);

  if (!user) {
    throw new AppError(
      ErrorMessages.INVALID_CREDENTIALS,
      401,
      ErrorCodes.INVALID_CREDENTIALS
    );
  }

  // Verify Password
  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError(
      ErrorMessages.INVALID_CREDENTIALS,
      401,
      ErrorCodes.INVALID_CREDENTIALS
    );
  }

  // Generate Tokens
  const accessToken =
    generateAccessToken(user.id);

  const refreshToken =
    generateRefreshToken(user.id);

  // Generate Device Id
  const deviceId =
    crypto.randomUUID();

const hashedRefreshToken =
  hashToken(refreshToken);
console.log("================================");
console.log("User ID:", user.id);
console.log("Device ID:", deviceId);
console.log("Refresh Key:", redisKeys.refreshToken(user.id, deviceId));
console.log("Refresh Token:", refreshToken);
console.log("Hashed Refresh Token:", hashedRefreshToken);
console.log("================================");
await redisService.set(
  redisKeys.refreshToken(
    user.id,
    deviceId
  ),
  hashedRefreshToken,
  60 * 60 * 24 * 30
);

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

export const refreshToken = async (
  input: RefreshTokenInput
) => {
  // 1. Verify JWT
  const payload = verifyRefreshToken(
    input.refreshToken
  );

  // 2. Redis Key
  const redisKey = redisKeys.refreshToken(
    payload.userId,
    input.deviceId
  );

  // 3. Get Stored Hash
  const storedHash =
    await redisService.get(redisKey);

  if (!storedHash) {
    throw new AppError(
      ErrorMessages.INVALID_REFRESH_TOKEN,
      401,
      ErrorCodes.INVALID_REFRESH_TOKEN
    );
  }

  // 4. Hash Incoming Refresh Token
  const incomingHash = hashToken(
    input.refreshToken
  );

  // 5. Compare Hashes
  if (storedHash !== incomingHash) {
    throw new AppError(
      "Invalid refresh token.",
      401,
      "INVALID_REFRESH_TOKEN"
    );
  }

  // 6. Generate New Tokens
  const accessToken =
    generateAccessToken(payload.userId);

  const newRefreshToken =
    generateRefreshToken(payload.userId);

  // 7. Hash New Refresh Token
  const newRefreshHash =
    hashToken(newRefreshToken);

  // 8. Replace Old Hash
  await redisService.set(
    redisKey,
    newRefreshHash,
    60 * 60 * 24 * 30
  );

  // 9. Return Tokens
  return {
    accessToken,
    refreshToken: newRefreshToken,
    deviceId: input.deviceId,
  };
};


export const logoutUser = async (
  userId: string,
  input: LogoutInput
): Promise<void> => {
  const redisKey = redisKeys.refreshToken(
    userId,
    input.deviceId
  );

  console.log("Deleting Key:", redisKey);

  const exists = await redisService.exists(redisKey);
  console.log("Exists Before Delete:", exists);

  await redisService.delete(redisKey);

  const existsAfter = await redisService.exists(redisKey);
  console.log("Exists After Delete:", existsAfter);
};
export const logoutAllDevices = async (
  userId: string
): Promise<void> => {
  const pattern = `refresh:${userId}:*`;

  const deleted =
    await redisService.deleteByPattern(
      pattern
    );

  if (deleted === 0) {
    throw new AppError(
      ErrorMessages.SESSION_EXPIRED,
      401,
      ErrorCodes.SESSION_EXPIRED
    );
  }
};

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