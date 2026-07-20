import { Schema, model } from "mongoose";
import type { ConversationDocument } from "./conversation.types.js";

const conversationSchema = new Schema<ConversationDocument>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    isGroup: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    groupName: {
      type: String,
      trim: true,
    },

    groupDescription: {
      type: String,
      trim: true,
      default: "",
    },

    groupAvatar: {
      type: String,
      default: "",
    },

    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    deletedFor: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ participants: 1 });

conversationSchema.index({ updatedAt: -1 });

conversationSchema.index({ lastMessageAt: -1 });

const Conversation = model<ConversationDocument>(
  "Conversation",
  conversationSchema
);

export default Conversation;