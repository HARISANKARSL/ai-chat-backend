import { env } from "./env.js";

export const config = {
  env: env.NODE_ENV,

  port: env.PORT,

  database: {
    uri: env.MONGODB_URI,
  },

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
};