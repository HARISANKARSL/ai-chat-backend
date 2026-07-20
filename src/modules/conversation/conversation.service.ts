import AppError from "../../common/errors/AppError.js";
import ErrorCodes from "../../common/errors/errorCodes.js";
import ErrorMessages from "../../common/errors/errorMessages.js";

import type { CreateConversationInput } from "./conversation.types.js";

import {
  createConversation,
  findConversationById,
  findExistingConversation,
  findUserConversations,
  softDeleteConversation,
} from "./conversation.repository.js";

export const createConversationService = async (
  userId: string,
  input: CreateConversationInput
) => {
  const participants = [...new Set([...input.participants, userId])];

  if (!input.isGroup && participants.length !== 2) {
    throw new AppError(
      "A personal conversation must have exactly two participants.",
      400,
      ErrorCodes.BAD_REQUEST
    );
  }

  if (!input.isGroup) {
    const existingConversation =
      await findExistingConversation(participants);

    if (existingConversation) {
      return existingConversation;
    }
  }

  return await createConversation({
    ...input,
    participants,
    createdBy: userId,
  });
};

export const getUserConversationsService = async (
  userId: string
) => {
  return await findUserConversations(userId);
};

export const getConversationByIdService = async (
  userId: string,
  conversationId: string
) => {
  const conversation =
    await findConversationById(conversationId);

  if (!conversation) {
    throw new AppError(
      ErrorMessages.CONVERSATION_NOT_FOUND,
      404,
      ErrorCodes.CONVERSATION_NOT_FOUND
    );
  }

  const isParticipant =
    conversation.participants.some(
      (participant) =>
        participant.toString() === userId
    );

  if (!isParticipant) {
    throw new AppError(
      ErrorMessages.UNAUTHORIZED,
      403,
      ErrorCodes.FORBIDDEN
    );
  }

  return conversation;
};

export const deleteConversationService = async (
  userId: string,
  conversationId: string
) => {
  const conversation =
    await findConversationById(conversationId);

  if (!conversation) {
    throw new AppError(
      ErrorMessages.CONVERSATION_NOT_FOUND,
      404,
      ErrorCodes.CONVERSATION_NOT_FOUND
    );
  }

  const isParticipant =
    conversation.participants.some(
      (participant) =>
        participant.toString() === userId
    );

  if (!isParticipant) {
    throw new AppError(
      ErrorMessages.UNAUTHORIZED,
      403,
      ErrorCodes.FORBIDDEN
    );
  }

  await softDeleteConversation(
    conversationId,
    userId
  );
};