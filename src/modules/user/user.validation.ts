import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .regex(
        /^[A-Za-z][A-Za-z\s'-]*$/,
        "Name must start with a letter and contain only letters, spaces, apostrophes, or hyphens"
      ),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(8, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must contain at least 8 characters"),
  }),
});