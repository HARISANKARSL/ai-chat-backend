import { Types } from "mongoose";

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILE = "FILE",
  SYSTEM = "SYSTEM",
  AI = "AI",
}

export interface Attachment {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface SeenInfo {
  user: Types.ObjectId;
  seenAt: Date;
}

export interface MessageDocument {
  _id: Types.ObjectId;

  conversation: Types.ObjectId;

  sender: Types.ObjectId;

  content: string;

  messageType: MessageType;

  attachments: Attachment[];

  replyTo?: Types.ObjectId | null;

  seenBy: SeenInfo[];

  deletedFor: Types.ObjectId[];

  isEdited: boolean;

  isDeleted: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateMessageInput {
  conversation: Types.ObjectId;

  sender: Types.ObjectId;

  content: string;

  messageType?: MessageType;

  attachments?: Attachment[];

  replyTo?: Types.ObjectId;
}