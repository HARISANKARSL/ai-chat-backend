import { Router } from "express";
import { logger } from "../logger/logger.js";
import validateRequest from "../common/middleware/validateRequest.middleware.js";

const router = Router();

router.get("/", (_req, res) => {
  logger.info("Health check endpoint called");

  res.status(200).json({
    success: true,
    message: "AI Chat Backend API",
        timestamp: new Date().toISOString(),
  });

 
});

export default router;