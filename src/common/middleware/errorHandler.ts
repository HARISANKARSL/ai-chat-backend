import type {
  NextFunction,
  Request,
  Response,
} from "express";

import AppError from "../errors/AppError.js";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.errorCode,
      showToast: err.showToast,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    showToast: true,
  });
};

export default errorHandler;