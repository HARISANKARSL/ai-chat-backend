import { Schema, model } from "mongoose";
import { MessageDocument, MessageType } from "./message.types.js";

const attachmentSchema = new Schema(
    {
        url: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const messageSchema = new Schema<MessageDocument>(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },

        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: String,
            trim: true,
            default: "",
        },

        messageType: {
            type: String,
            enum: Object.values(MessageType),
            default: MessageType.TEXT,
            required: true,
        },

        attachments: {
            type: [attachmentSchema],
            default: [],
        },

        replyTo: {
            type: Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },

        seenBy: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        deletedFor: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        isEdited: {
            type: Boolean,
            default: false,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const messageModel = model<MessageDocument>("Message", messageSchema);

export default messageModel;