import { Request, Response, NextFunction } from "express";
import * as messageService from "./message.service.js";
import { AuthRequest } from "../../types/auth-request.js";

type ConversationParams = {
  conversationId: string;
};

type MessageParams = {
  messageId: string;
};

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = await messageService.sendMessage(req.body);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversationMessages = async (
  req: Request<ConversationParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId } = req.params;

    const messages =
      await messageService.getConversationMessages(
        conversationId
      );

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessage = async (
  req: Request<MessageParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { messageId } = req.params;

    const message = await messageService.getMessage(
      messageId
    );

    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};



export const markMessageSeenController = async (
  req: AuthRequest & { params: MessageParams },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const message = await messageService.markSeen(
      req.params.messageId,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: "Message marked as seen.",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};