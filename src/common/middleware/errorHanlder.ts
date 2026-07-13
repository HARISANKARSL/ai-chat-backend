import { Request, Response, NextFunction } from "express";
import AppError from "../errors/appError.js";


const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,

      code: err.code,

      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,

    code: "INTERNAL_SERVER_ERROR",

    message: "Something went wrong",
  });
};

export default errorHandler;