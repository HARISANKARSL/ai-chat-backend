import { Types } from "mongoose";

import {
  createMessage,
  findConversationMessages,
  findMessageById,
} from "./message.repository.js";

import {
  findConversationById,
  updateLastMessage,
} from "../conversation/conversation.repository.js";

import {
  CreateMessageInput,
  MessageType,
} from "./message.types.js";

export const sendMessage = async (
  input: CreateMessageInput
) => {
  // Check if conversation exists
  const conversation = await findConversationById(
    input.conversation.toString()
  );

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  // Verify sender is a participant
  const isParticipant = conversation.participants.some(
    (participant: Types.ObjectId) =>
      participant.toString() === input.sender.toString()
  );

  if (!isParticipant) {
    throw new Error(
      "You are not a participant of this conversation."
    );
  }

  // Validate message
  const hasContent = input.content?.trim().length > 0;
  const hasAttachments =
    input.attachments &&
    input.attachments.length > 0;

  if (!hasContent && !hasAttachments) {
    throw new Error(
      "Message must contain text or at least one attachment."
    );
  }

  // Default message type
  const payload = {
    ...input,
    messageType:
      input.messageType ?? MessageType.TEXT,
  };

  // Create message
  const message = await createMessage(payload);

  // Update conversation
  await updateLastMessage(
    input.conversation.toString(),
    message._id.toString()
  );

  return message;
};

export const getConversationMessages = async (
  conversationId: string
) => {
  const conversation = await findConversationById(
    conversationId
  );

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  return await findConversationMessages(
    conversationId
  );
};

export const getMessage = async (
  messageId: string
) => {
  const message = await findMessageById(
    messageId
  );

  if (!message) {
    throw new Error("Message not found.");
  }

  return message;
};