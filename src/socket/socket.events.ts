export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  JOIN_CONVERSATION: "join-conversation",
  LEAVE_CONVERSATION: "leave-conversation",

  SEND_MESSAGE: "send-message",
  NEW_MESSAGE: "new-message",

  TYPING: "typing",
  STOP_TYPING: "stop-typing",

  MESSAGE_SEEN: "message-seen",
} as const;