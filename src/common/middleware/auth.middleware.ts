import type {
  NextFunction,
  Request,
  Response,
} from "express";

import AppError from "../errors/AppError.js";
import ErrorCodes from "../errors/errorCodes.js";
import ErrorMessages from "../errors/errorMessages.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(
      ErrorMessages.UNAUTHORIZED,
      401,
      ErrorCodes.UNAUTHORIZED
    );
  }

const token = authHeader.split(" ")[1];

if (!token) {
  throw new AppError(
    ErrorMessages.UNAUTHORIZED,
    401,
    ErrorCodes.UNAUTHORIZED
  );
}

const payload = verifyAccessToken(token) as {
  userId: string;
};

req.user = {
  userId: payload.userId,
};

next();
};