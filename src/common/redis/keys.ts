export const redisKeys = {
  refreshToken: (
    userId: string,
    deviceId: string
  ) =>
    `refresh:${userId}:${deviceId}`,

  otp: (email: string) =>
    `otp:${email}`,

  onlineUser: (
    userId: string
  ) =>
    `online:${userId}`,

  typing: (
    conversationId: string
  ) =>
    `typing:${conversationId}`,

  cache: (key: string) =>
    `cache:${key}`,
} as const;