import { pinoHttp } from "pino-http";
import { logger } from "../../logger/logger.js";

export const httpLogger = pinoHttp({
  logger,
});