import { changePasswordSchema, updateProfileSchema } from "./user.validation.js";
import { z } from "zod";
export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}
export interface JwtPayload {
  userId: string;
}

export type UpdateProfileInput = z.infer<
  typeof updateProfileSchema
>["body"];

export type ChangePasswordInput =
  z.infer<typeof changePasswordSchema>["body"];