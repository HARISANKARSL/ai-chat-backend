import type { Response } from "express";

interface SuccessResponse<T = unknown> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  showToast?: boolean;
}

export const successResponse = <T>({
  res,
  statusCode = 200,
  message,
  data,
  showToast = false,
}: SuccessResponse<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    showToast,
    data,
  });
};