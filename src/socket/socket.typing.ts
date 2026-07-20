import { Server, Socket } from "socket.io";

import { SOCKET_EVENTS } from "./socket.events.js";

export const handleTyping = (
  io: Server,
  socket: Socket
): void => {
  socket.on(
    SOCKET_EVENTS.TYPING,
    (conversationId: string) => {
      socket.to(conversationId).emit(
        SOCKET_EVENTS.TYPING,
        {
          conversationId,
          userId: socket.data.user.userId,
        }
      );
    }
  );

  socket.on(
    SOCKET_EVENTS.STOP_TYPING,
    (conversationId: string) => {
      socket.to(conversationId).emit(
        SOCKET_EVENTS.STOP_TYPING,
        {
          conversationId,
          userId: socket.data.user.userId,
        }
      );
    }
  );
};