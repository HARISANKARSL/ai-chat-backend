import { getIO } from "./socket.js";
import { getUserSockets } from "./socket.presence.js";

class SocketService {
  /**
   * Emit event to a single socket
   */
  emitToSocket(
    socketId: string,
    event: string,
    payload: unknown
  ): void {
    getIO().to(socketId).emit(event, payload);
  }

  /**
   * Emit event to all active sockets of a user
   */
  async emitToUser(
    userId: string,
    event: string,
    payload: unknown
  ): Promise<void> {
    const socketIds = await getUserSockets(userId);

    for (const socketId of socketIds) {
      this.emitToSocket(
        socketId,
        event,
        payload
      );
    }
  }

  /**
   * Emit event to multiple users
   */
  async emitToUsers(
    userIds: string[],
    event: string,
    payload: unknown
  ): Promise<void> {
    for (const userId of userIds) {
      await this.emitToUser(
        userId,
        event,
        payload
      );
    }
  }

  /**
   * Emit event to everyone in a conversation except sender
   */
  async emitToConversation(
    participants: string[],
    senderId: string,
    event: string,
    payload: unknown
  ): Promise<void> {
    const receivers = participants.filter(
      (id) => id !== senderId
    );

    await this.emitToUsers(
      receivers,
      event,
      payload
    );
  }
}

export const socketService =
  new SocketService();