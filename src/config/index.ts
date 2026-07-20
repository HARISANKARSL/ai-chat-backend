import { env } from "./env.js";

export const config = {
  env: env.NODE_ENV,

  port: env.PORT,

  cors: {
    origin: env.CORS_ORIGIN,
  },

  database: {
    uri: env.MONGODB_URI,
  },

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
  },
} as const;