import type { Request, Response } from "express";


import { successResponse } from "../../common/utils/response.js";

import {
  changePassword,
  deleteMyAccount,
  getAllUsers,
  getUserById,
  updateProfile,
} from "./user.service.js";
import asyncHandler from "../../common/handlers/asyncHandler.js";

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await getAllUsers();

  return successResponse({
    res,
    data: users,
  });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id as string);

  return successResponse({
    res,
    data: user,
  });
});

export const updateMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("UPDATE PROFILE HIT");

    const user = await updateProfile(
      req.user.userId,
      req.body
    );

    return successResponse({
      res,
      message: "Profile Updated Successfully",
      showToast: true,
      data: user,
    });
  }
);

export const changeMyPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await changePassword(
      req.user.userId,
      req.body
    );

    return successResponse({
      res,
      message: "Password Changed Successfully",
      showToast: true,
    });
  }
);

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteMyAccount(req.user.userId);

    return successResponse({
      res,
      message: "Account Deleted Successfully",
      showToast: true,
    });
  }
);