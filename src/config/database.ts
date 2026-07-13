import mongoose from "mongoose";
import { config } from "./index.js";
import { logger } from "../logger/logger.js";


const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.uri);

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error(error, "MongoDB connection failed");

    process.exit(1);
  }
};

export default connectDatabase;