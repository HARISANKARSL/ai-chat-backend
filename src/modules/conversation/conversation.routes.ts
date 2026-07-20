import { Router } from "express";

import {
  createConversationHandler,
  deleteConversationHandler,
  getConversationByIdHandler,
  getUserConversationsHandler,
  
} from "./conversation.controller.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";


const router = Router();

/**
 * Create a new conversation
 * POST /api/conversations
 */
router.post(
  "/",
  authenticate,
  createConversationHandler
);

/**
 * Get all conversations of logged-in user
 * GET /api/conversations
 */
router.get(
  "/",
  authenticate,
  getUserConversationsHandler
);

/**
 * Get conversation by id
 * GET /api/conversations/:id
 */
router.get(
  "/:id",
  authenticate,
  getConversationByIdHandler
);

/**
 * Delete conversation for current user
 * DELETE /api/conversations/:id
 */
router.delete(
  "/:id",
  authenticate,
  deleteConversationHandler
);

export default router;