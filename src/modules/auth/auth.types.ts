import { z } from "zod";
import { registerBodySchema } from "./auth.validation.js";
import { loginBodySchema } from "./auth.validation.js";

export type RegisterInput = z.infer<
  typeof registerBodySchema
>;

export type LoginInput = z.infer<
  typeof loginBodySchema
>;
export interface RefreshTokenInput {
  refreshToken: string;
  deviceId: string;
}

export interface LogoutInput {
  deviceId: string;
}