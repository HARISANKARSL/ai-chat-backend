import { Types } from "mongoose";
export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  SYSTEM = "SYSTEM",
  AI = "AI",
}

export type Attachment = {
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
};

export type MessageDocument = {
    _id: Types.ObjectId;

    conversation: Types.ObjectId;

    sender: Types.ObjectId;

    content: string;

    messageType: MessageType;

    attachments?: Attachment[];

    replyTo?: Types.ObjectId;

    seenBy: Types.ObjectId[];

    deletedFor: Types.ObjectId[];

    isEdited: boolean;

    isDeleted: boolean;

    createdAt: Date;

    updatedAt: Date;
};

export type CreateMessageInput = {
    conversation: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
    messageType: MessageType;
    attachments?: Attachment[];
    replyTo?: Types.ObjectId;
};