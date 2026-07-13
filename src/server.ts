import app from "./app.js";
import { logger } from "./logger/logger.js";
import connectDatabase from "./config/database.js";
import { config } from "./config/index.js";


const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(config.port, () => {
    logger.info(
      `🚀 Server running on http://localhost:${config.port}`
    );
  });
};

startServer();