import { Socket } from "socket.io";

import { verifyAccessToken } from "../utils/jwt.js";

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
): void => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(
        new Error("Authentication token is required")
      );
    }

    const payload = verifyAccessToken(token);

    socket.data.user = {
      userId: payload.userId,
    };

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};