import mongoose, {
  Schema,
  Document,
} from "mongoose";

import { SecurityEvent } from "./security.constants.js";

export interface SecurityLogDocument
  extends Document {
  userId?: mongoose.Types.ObjectId;

  event: SecurityEvent;

  ip?: string;

  userAgent?: string;

  deviceId?: string;

  success: boolean;

  metadata?: Record<string, unknown>;

  createdAt: Date;

  updatedAt: Date;
}

const securityLogSchema =
  new Schema<SecurityLogDocument>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      event: {
        type: String,

        enum: Object.values(
          SecurityEvent
        ),

        required: true,
      },

      ip: {
        type: String,
      },

      userAgent: {
        type: String,
      },

      deviceId: {
        type: String,
      },

      success: {
        type: Boolean,

        required: true,
      },

      metadata: {
        type: Schema.Types.Mixed,

        default: {},
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "SecurityLog",
  securityLogSchema
);