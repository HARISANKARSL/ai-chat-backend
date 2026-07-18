import { Router } from "express";

import validateRequest from "../../common/middleware/validateRequest.middleware.js";
import { login, logout, logoutAll, me, refresh, register } from "./auth.controller.js";
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from "./auth.validation.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";
import { rateLimit } from "../../common/middleware/rateLimit.middleware.js";

const router = Router();
const loginLimiter = rateLimit(
  "login",
  5,
  15 * 60
);
router.post(
  "/register",
  validateRequest(registerSchema),
  register
);
router.post(
  "/login",
  loginLimiter,
  validateRequest(loginSchema),
  login
);
router.post(
  "/refresh",
  validateRequest(refreshSchema),
  refresh
);
router.post(
  "/logout",
  authenticate,
  validateRequest(logoutSchema),
  logout
);
router.post(
  "/logout-all",
  authenticate,
  logoutAll
);
router.get(
  "/me",
  authenticate,
  me
);


export default router;