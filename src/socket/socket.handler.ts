import { Server, Socket } from "socket.io";

import { logger } from "../logger/logger.js";
import { SOCKET_EVENTS } from "./socket.events.js";

import {
  addUserSocket,
  removeUserSocket,
} from "./socket.presence.js";

import {
  joinConversationRoom,
  leaveConversationRoom,
} from "./socket.room.js";
import { handleTyping } from "./socket.typing.js";

export const registerSocketHandlers = (
  io: Server
): void => {
  io.on(
    SOCKET_EVENTS.CONNECTION,
    async (socket: Socket) => {
      try {
        const { userId } = socket.data.user;

        await addUserSocket(
          userId,
          socket.id
        );

        logger.info(
          `✅ User Connected: ${userId} | Socket: ${socket.id}`
        );
handleTyping(io, socket);
        /**
         * Join Conversation
         */
        socket.on(
          SOCKET_EVENTS.JOIN_CONVERSATION,
          async (
            conversationId: string
          ) => {
            try {
              await joinConversationRoom(
                socket,
                conversationId
              );

              logger.info(
                `📥 User ${userId} joined conversation ${conversationId}`
              );
            } catch (error) {
              logger.error(error);

              socket.emit("error", {
                message:
                  error instanceof Error
                    ? error.message
                    : "Failed to join conversation.",
              });
            }
          }
        );

        /**
         * Leave Conversation
         */
        socket.on(
          SOCKET_EVENTS.LEAVE_CONVERSATION,
          async (
            conversationId: string
          ) => {
            try {
              await leaveConversationRoom(
                socket,
                conversationId
              );

              logger.info(
                `📤 User ${userId} left conversation ${conversationId}`
              );
            } catch (error) {
              logger.error(error);

              socket.emit("error", {
                message:
                  error instanceof Error
                    ? error.message
                    : "Failed to leave conversation.",
              });
            }
          }
        );

        /**
         * Disconnect
         */
        socket.on(
          SOCKET_EVENTS.DISCONNECT,
          async () => {
            await removeUserSocket(
              userId,
              socket.id
            );

            logger.info(
              `❌ User Disconnected: ${userId} | Socket: ${socket.id}`
            );
          }
        );
      } catch (error) {
        logger.error(error);

        socket.disconnect(true);
      }
    }
  );
};