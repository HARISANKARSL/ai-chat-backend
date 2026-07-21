import { z } from "zod";
import { MessageType } from "./message.types.js";

export const createMessageSchema = z.object({
  body: z
    .object({
      conversation: z
        .string()
        .min(1, "Conversation ID is required"),

      sender: z
        .string()
        .min(1, "Sender ID is required"),

      content: z.string().trim().optional(),

      messageType: z
        .nativeEnum(MessageType)
        .optional(),

      attachments: z
        .array(
          z.object({
            url: z.string().url(),
            fileName: z.string(),
            mimeType: z.string(),
            size: z.number().min(0),
          })
        )
        .optional(),

      replyTo: z.string().optional(),
    })
    .refine(
      (data) =>
        !!data.content?.trim() ||
        (data.attachments?.length ?? 0) > 0,
      {
        message:
          "Message must contain text or at least one attachment.",
        path: ["content"],
      }
    ),
});