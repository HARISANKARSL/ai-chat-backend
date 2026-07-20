import http from "http";

import app from "./app.js";
import { logger } from "./logger/logger.js";
import connectDatabase from "./config/database.js";
import { config } from "./config/index.js";

import { connectRedis } from "./common/redis/redis.js";
import { initializeSocket } from "./socket/index.js";

const startServer = async (): Promise<void> => {
  try {
    // MongoDB Connection
    await connectDatabase();
    logger.info("✅ MongoDB Connected Successfully");

    // Redis Connection
    await connectRedis();
    logger.info("✅ Redis Connected Successfully");

    // Create HTTP Server
    const server = http.createServer(app);

    // Initialize Socket.IO
    initializeSocket(server);

    // Start Server
    server.listen(config.port, () => {
      logger.info(`🚀 Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

startServer();