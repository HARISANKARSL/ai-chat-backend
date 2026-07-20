import { Socket } from "socket.io";

import { findConversationById } from "../modules/conversation/conversation.repository.js";

export const joinConversationRoom = async (
  socket: Socket,
  conversationId: string
): Promise<void> => {
  const conversation = await findConversationById(
    conversationId
  );

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  const userId = socket.data.user.userId;

  const isParticipant = conversation.participants.some(
    (participant) =>
      participant.toString() === userId
  );

  if (!isParticipant) {
    throw new Error(
      "You are not a participant of this conversation."
    );
  }

  await socket.join(conversationId);
};

export const leaveConversationRoom = async (
  socket: Socket,
  conversationId: string
): Promise<void> => {
  await socket.leave(conversationId);
};