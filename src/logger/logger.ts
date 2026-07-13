import pino from "pino";
import { config } from "../config/index.js";

const baseOptions = {
  level: config.env === "development" ? "debug" : "info",
};

export const logger = pino({
  // include transport only for development to avoid assigning undefined
  ...(config.env === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        },
      }
    : {}),
  ...baseOptions,
});