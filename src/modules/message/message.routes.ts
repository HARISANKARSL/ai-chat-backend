import { Router } from "express";

import * as messageController from "./message.controller.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";

const router = Router();

router.post(
  "/send",
  authenticate,
  messageController.sendMessage
);

router.get(
  "/conversation/:conversationId",
  authenticate,
  messageController.getConversationMessages
);

router.get(
  "/:messageId",
  authenticate,
  messageController.getMessage
);

export default router;