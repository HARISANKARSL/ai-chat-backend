import { z } from "zod";

export const registerBodySchema = z.object({
name: z
  .string()
  .trim()
  .min(2, "Name must contain at least 2 characters")
  .max(50, "Name cannot exceed 50 characters")
  .regex(
    /^[A-Za-z][A-Za-z\s'-]*$/,
    "Name must start with a letter and contain only letters, spaces, apostrophes, or hyphens"
  ),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password cannot exceed 72 characters"),
});

export const registerSchema = z.object({
  body: registerBodySchema,
});


export const loginBodySchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters"),
});

export const loginSchema = z.object({
  body: loginBodySchema,
});

export const refreshBodySchema = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token is required"),

  deviceId: z
    .string()
    .uuid("Invalid device id"),
});

export const refreshSchema = z.object({
  body: refreshBodySchema,
});

export const logoutBodySchema = z.object({
  deviceId: z
    .string()
    .uuid("Invalid device id"),
});

export const logoutSchema = z.object({
  body: logoutBodySchema,
});