import { Router } from "express";

import * as messageController from "./message.controller.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";
// import { validate } from "../../common/middleware/validate.middleware.js";
// import { createMessageSchema } from "./message.validation.js";
import validateRequest from "../../common/middleware/validateRequest.middleware.js";
import { createMessageSchema } from "./message.validation.js";

const router = Router();

// All message routes require authentication
router.use(authenticate);

/**
 * Send a message
 */
router.post(
  "/",
  validateRequest(createMessageSchema),
  messageController.sendMessage
);

/**
 * Get conversation messages (Cursor Pagination)
 *
 * GET /messages/conversation/:conversationId?limit=20&cursor=<messageId>
 */
router.get(
  "/conversation/:conversationId",
  messageController.getMessages
);

/**
 * Get single message
 */
router.get(
  "/:messageId",
  messageController.getMessage
);

/**
 * Mark message as seen
 */
router.patch(
  "/:messageId/seen",
  messageController.markMessageSeen
);

export default router;