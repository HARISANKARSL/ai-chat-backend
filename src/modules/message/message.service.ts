import { Types } from "mongoose";

import {
  createMessage,
  findMessageById,
  getConversationMessages,
  markMessageSeen,
} from "./message.repository.js";

import {
  findConversationById,
  updateLastMessage,
} from "../conversation/conversation.repository.js";

import {
  CreateMessageInput,
  MessageType,
} from "./message.types.js";

import { socketService } from "../../socket/socket.service.js";
import { SOCKET_EVENTS } from "../../socket/socket.events.js";

export const sendMessage = async (
  input: CreateMessageInput
) => {
  const conversation = await findConversationById(
    input.conversation.toString()
  );

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  const isParticipant = conversation.participants.some(
    (participant: Types.ObjectId) =>
      participant.toString() === input.sender.toString()
  );

  if (!isParticipant) {
    throw new Error(
      "You are not a participant of this conversation."
    );
  }

  const hasContent =
    input.content?.trim().length > 0;

  const hasAttachments =
    input.attachments &&
    input.attachments.length > 0;

  if (!hasContent && !hasAttachments) {
    throw new Error(
      "Message must contain text or at least one attachment."
    );
  }

  const payload = {
    ...input,
    messageType:
      input.messageType ??
      MessageType.TEXT,
  };

  const message =
    await createMessage(payload);

  await updateLastMessage(
    input.conversation.toString(),
    message._id.toString()
  );

  await socketService.emitToConversation(
    conversation.participants.map((participant) =>
      participant.toString()
    ),
    input.sender.toString(),
    SOCKET_EVENTS.NEW_MESSAGE,
    message
  );

  return message;
};

export const getMessages = async (
  conversationId: string,
  limit = 20,
  cursor?: string
) => {
  const conversation =
    await findConversationById(
      conversationId
    );

  if (!conversation) {
    throw new Error(
      "Conversation not found."
    );
  }

  return await getConversationMessages(
    conversationId,
    limit,
    cursor
  );
};

export const getMessage = async (
  messageId: string
) => {
  const message =
    await findMessageById(messageId);

  if (!message) {
    throw new Error(
      "Message not found."
    );
  }

  return message;
};

export const markSeen = async (
  messageId: string,
  userId: string
) => {
  const message =
    await findMessageById(messageId);

  if (!message) {
    throw new Error(
      "Message not found."
    );
  }

  const alreadySeen =
    message.seenBy.some(
      (seen) =>
        seen.user.toString() === userId
    );

  if (alreadySeen) {
    return message;
  }

  const updated =
    await markMessageSeen(
      messageId,
      userId
    );

  await socketService.emitToConversation(
    [message.sender.toString()],
    userId,
    SOCKET_EVENTS.MESSAGE_SEEN,
    updated
  );

  return updated;
};