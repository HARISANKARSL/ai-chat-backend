import jwt from "jsonwebtoken";
import { config } from "../../config/index.js";

export interface TokenPayload {
  userId: string;
}

export const generateAccessToken = (
  userId: string
): string => {
  return jwt.sign(
    { userId },
    config.jwt.accessSecret,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (
  userId: string
): string => {
  return jwt.sign(
    { userId },
    config.jwt.refreshSecret,
    {
      expiresIn: "30d",
    }
  );
};

export const verifyAccessToken = (
  token: string
): TokenPayload => {
  return jwt.verify(
    token,
    config.jwt.accessSecret
  ) as TokenPayload;
};

export const verifyRefreshToken = (
  token: string
): TokenPayload => {
  return jwt.verify(
    token,
    config.jwt.refreshSecret
  ) as TokenPayload;
};