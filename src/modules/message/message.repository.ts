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
  return await messageModel.findById(messageId);
};

export const findConversationMessages = async (
  conversationId: string
) => {
  return await messageModel
    .find({
      conversation: conversationId,
      isDeleted: false,
    })
    .sort({ createdAt: 1 })
    .populate("sender", "username fullName profileImage")
    .populate("replyTo");
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