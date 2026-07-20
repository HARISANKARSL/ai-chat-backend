import { Router } from "express";

import healthRoute from "./health.route.js";
import authRoute from "../modules/auth/auth.route.js";
import { authenticate } from "../common/middleware/auth.middleware.js";
import userRoutes from "../modules/user/user.route.js";
import messageRoutes from "../modules/message/message.routes.js";
import conversationRoutes from "../modules/conversation/conversation.routes.js";
const router = Router();

router.use("/health", healthRoute);
router.get(
  "/test",
  authenticate,
  (_req, res) => {
    res.json({
      message: "Protected Route",
    });
  }
);
router.use("/auth", authRoute);
router.use("/users", userRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);
export default router;