import { Router } from "express";

import { authenticate } from "../../common/middleware/auth.middleware.js";
import validateRequest from "../../common/middleware/validateRequest.middleware.js";

import {
  getUsers,
  getUser,
  updateMyProfile,
  changeMyPassword,
  deleteAccount,
} from "./user.controller.js";

import { changePasswordSchema, updateProfileSchema } from "./user.validation.js";

const router = Router();

// Get all users
router.get("/", authenticate, getUsers);

// Update logged in user
router.put(
  "/profile",
  authenticate,
  validateRequest(updateProfileSchema),
  updateMyProfile
);
router.put(
  "/change-password",
  authenticate,
  validateRequest(changePasswordSchema),
  changeMyPassword
);

router.delete(
  "/me",
  authenticate,
  deleteAccount
);

// Get user by id (KEEP THIS LAST)
router.get("/:id", authenticate, getUser);

export default router;