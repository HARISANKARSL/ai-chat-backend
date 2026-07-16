import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum([
    "development",
    "production",
    "test",
  ]),

  PORT: z.coerce.number(),

  MONGODB_URI: z.string(),

  JWT_ACCESS_SECRET: z.string(),

  JWT_REFRESH_SECRET: z.string(),

  JWT_ACCESS_EXPIRES_IN: z.string(),

  JWT_REFRESH_EXPIRES_IN: z.string(),

  REDIS_HOST: z.string(),

  REDIS_PORT: z.coerce.number(),

  REDIS_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid Environment Variables");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;