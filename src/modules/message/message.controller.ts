import { Request, Response, NextFunction, RequestHandler } from "express";
import * as messageService from "./message.service.js";
import { AuthRequest } from "../../types/auth-request.js";

type ConversationParams = {
  conversationId: string;
};

type MessageParams = {
  messageId: string;
};

type ConversationQuery = {
  limit?: string;
  cursor?: string;
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

export const getMessages = async (
  req: Request<
    ConversationParams,
    unknown,
    unknown,
    ConversationQuery
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { conversationId } = req.params;

    const limit = Math.max(
      1,
      Number(req.query.limit) || 20
    );

    const cursor = req.query.cursor;

    const messages =
      await messageService.getMessages(
        conversationId,
        limit,
        cursor
      );

    const nextCursor =
      messages.length === limit
        ? messages[0]?.id ?? null
        : null;

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        limit,
        hasMore: messages.length === limit,
        nextCursor,
      },
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

    const message =
      await messageService.getMessage(
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



export const markMessageSeen = async (
  req: Request<MessageParams>,
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