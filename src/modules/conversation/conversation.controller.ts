import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createConversationService,
  getConversationByIdService,
  getUserConversationsService,
  deleteConversationService,
} from "./conversation.service.js";

interface ConversationParams {
  id?: string;
}

export const createConversationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const conversation = await createConversationService(
      req.user.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Conversation created successfully.",
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserConversationsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const conversations = await getUserConversationsService(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

interface ConversationParams {
  id?: string;
}

export const getConversationByIdHandler = async (
  req: Request<ConversationParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const conversationId = req.params.id;

    if (!conversationId) {
      res.status(400).json({
        success: false,
        message: "Conversation id is required.",
      });
      return;
    }

    const conversation = await getConversationByIdService(
      req.user.userId,
      conversationId
    );

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteConversationHandler = async (
  req: Request<ConversationParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const conversationId = req.params.id;

    if (!conversationId) {
      res.status(400).json({
        success: false,
        message: "Conversation id is required.",
      });
      return;
    }

    await deleteConversationService(
      req.user.userId,
      conversationId
    );

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};