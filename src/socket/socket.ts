import { Server as HttpServer } from "http";
import { Server } from "socket.io";

import { config } from "../config/index.js";

import { registerSocketHandlers } from "./socket.handler.js";
import { socketAuthMiddleware } from "../common/middleware/socket.middleware.js";

let io: Server;

export const initializeSocket = (
  server: HttpServer
): Server => {
  io = new Server(server, {
    cors: {
      origin: config.cors.origin,
      credentials: true,
    },
  });

  // Authenticate every socket connection
  io.use(socketAuthMiddleware);

  // Register all events
  registerSocketHandlers(io);

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};