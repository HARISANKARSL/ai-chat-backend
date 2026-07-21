import messageModel from "./message.model.js";
import { CreateMessageInput } from "./message.types.js";

export const createMessage = async (
  data: CreateMessageInput
) => {
  return await messageModel.create(data);
};

export const findMessageById = async (
  messageId: string
) => {
  return await messageModel
    .findById(messageId)
    .populate("sender", "username fullName profileImage")
    .populate("replyTo");
};

export const getConversationMessages = async (
  conversationId: string,
  limit = 20,
  cursor?: string
) => {
  const query: Record<string, unknown> = {
    conversation: conversationId,
    isDeleted: false,
  };

  if (cursor) {
    query._id = {
      $lt: cursor,
    };
  }

  const messages = await messageModel
    .find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .populate("sender", "username fullName profileImage")
    .populate("replyTo");

  return messages.reverse();
};

export const updateMessage = async (
  messageId: string,
  data: Partial<CreateMessageInput>
) => {
  return await messageModel.findByIdAndUpdate(
    messageId,
    data,
    {
      new: true,
    }
  );
};

export const deleteMessage = async (
  messageId: string
) => {
  return await messageModel.findByIdAndUpdate(
    messageId,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );
};

export const markMessageSeen = async (
  messageId: string,
  userId: string
) => {
  return await messageModel
    .findByIdAndUpdate(
      messageId,
      {
        $addToSet: {
          seenBy: {
            user: userId,
            seenAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    )
    .populate("sender", "username fullName profileImage")
    .populate("seenBy.user", "username fullName profileImage");
};