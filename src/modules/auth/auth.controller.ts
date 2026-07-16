import type {
  Request,
  Response,
} from "express";


import { successResponse } from "../../common/utils/response.js";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshToken,
  logoutUser,
  logoutAllDevices,
} from "./auth.service.js";
import asyncHandler from "../../common/handlers/asyncHandler.js";

export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await registerUser(req.body);

    return successResponse({
      res,
      statusCode: 201,
      message: "User Registered Successfully",
      showToast: true,
      data: user,
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await loginUser(req.body);

    return successResponse({
      res,
      message: "Login Successful",
      showToast: true,
      data: result,
    });
  }
);

export const me = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await getCurrentUser(
      req.user.userId
    );

    return successResponse({
      res,
      data: user,
    });
  }
);

export const refresh = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await refreshToken(
      req.body
    );

    return successResponse({
      res,
      message: "Token Refreshed Successfully",
      showToast: false,
      data: result,
    });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response) => {
    await logoutUser(
      req.user.userId,
      req.body
    );

    return successResponse({
      res,
      message: "Logout Successful",
      showToast: true,
    });
  }
);
export const logoutAll = asyncHandler(
  async (req: Request, res: Response) => {
    await logoutAllDevices(
      req.user.userId
    );

    return successResponse({
      res,
      message:
        "Logged out from all devices successfully.",
      showToast: true,
    });
  }
);