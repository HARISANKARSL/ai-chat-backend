import { createClient } from "redis";
import { config } from "../../config/index.js";
import { logger } from "../../logger/logger.js";

const redisOptions = config.redis.password
  ? {
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password,
    }
  : {
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
    };

export const redisClient =
  createClient(redisOptions);

redisClient.on("connect", () => {
  logger.info("🟡 Connecting to Redis...");
});

redisClient.on("ready", () => {
  logger.info("✅ Redis Connected Successfully");
});

redisClient.on("error", (error) => {
  logger.error(`❌ Redis Error: ${error.message}`);
});

export const connectRedis = async (): Promise<void> => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};