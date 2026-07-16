import app from "./app.js";
import { logger } from "./logger/logger.js";
import connectDatabase from "./config/database.js";
import { config } from "./config/index.js";

import { connectRedis } from "./common/redis/redis.js";
import { redisService } from "./common/redis/service.js";

const startServer = async (): Promise<void> => {
  try {
    // MongoDB Connection
    await connectDatabase();
    logger.info("✅ MongoDB Connected Successfully");

    // Redis Connection
    await connectRedis();



   

    // Start Express Server
    app.listen(config.port, () => {
      logger.info(
        `🚀 Server running on http://localhost:${config.port}`
      );
    });
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
};

startServer();