import Conversation from "./conversation.model.js";
import type { CreateConversationInput } from "./conversation.types.js";

interface CreateConversationRepositoryInput
  extends CreateConversationInput {
  createdBy: string;
  participants: string[];
}

export const createConversation = async (
  input: CreateConversationRepositoryInput
) => {
  const payload: Record<string, unknown> = {
    participants: input.participants,
    isGroup: input.isGroup ?? false,
    createdBy: input.createdBy,
    admins: input.isGroup ? [input.createdBy] : [],
    deletedFor: [],
  };

  if (input.groupName !== undefined) {
    payload.groupName = input.groupName;
  }

  if (input.groupDescription !== undefined) {
    payload.groupDescription = input.groupDescription;
  }

  if (input.groupAvatar !== undefined) {
    payload.groupAvatar = input.groupAvatar;
  }

  return await Conversation.create(payload);
};

export const findExistingConversation = async (
  participants: string[]
) => {
  return await Conversation.findOne({
    isGroup: false,
    participants: {
      $all: participants,
      $size: 2,
    },
  });
};

export const findConversationById = async (
  conversationId: string
) => {
  return await Conversation.findById(
    conversationId
  );
};

export const findUserConversations = async (
  userId: string
) => {
  return await Conversation.find({
    participants: userId,
    deletedFor: {
      $ne: userId,
    },
  })
    .sort({
      lastMessageAt: -1,
    })
    .populate(
      "participants",
      "username fullName profileImage"
    )
    .populate("lastMessage");
};

export const softDeleteConversation = async (
  conversationId: string,
  userId: string
) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    {
      $addToSet: {
        deletedFor: userId,
      },
    },
    {
      new: true,
    }
  );
};

export const updateLastMessage = async (
  conversationId: string,
  messageId: string
) => {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    {
      lastMessage: messageId,
      lastMessageAt: new Date(),
    },
    {
      new: true,
    }
  );
};