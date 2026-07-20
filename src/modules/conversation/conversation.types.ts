import { Types } from "mongoose";

export interface CreateConversationInput {
  participants: string[];
  isGroup?: boolean;
  groupName?: string;
  groupDescription?: string;
  groupAvatar?: string;
}

export interface ConversationDocument {
  _id: Types.ObjectId;

  participants: Types.ObjectId[];

  isGroup: boolean;

  createdBy: Types.ObjectId;

  groupName?: string;

  groupDescription?: string;

  groupAvatar?: string;

  admins: Types.ObjectId[];

  lastMessage?: Types.ObjectId;

  lastMessageAt?: Date;

  deletedFor: Types.ObjectId[];

  createdAt: Date;

  updatedAt: Date;
}