import { Router } from "express";

import healthRoute from "./health.route.js";
import validateRequest from "../common/middleware/validateRequest.middleware.js";
import { registerSchema } from "../modules/auth/auth.validation.js";
import { register } from "../modules/auth/auth.controller.js";

const router = Router();

// Health Routes
router.use("/health", healthRoute);


router.post(
  "/register",
  validateRequest(registerSchema),
  register
);

export default router;