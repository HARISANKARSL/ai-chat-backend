import { redisService } from "../common/redis/service.js";

const USER_SOCKET_PREFIX = "user:sockets:";

const getSocketKey = (userId: string): string => {
  return `${USER_SOCKET_PREFIX}${userId}`;
};

/**
 * Store a socket for a user
 */
export const addUserSocket = async (
  userId: string,
  socketId: string
): Promise<void> => {
  await redisService.sAdd(getSocketKey(userId), socketId);
};

/**
 * Remove a socket from a user
 */
export const removeUserSocket = async (
  userId: string,
  socketId: string
): Promise<void> => {
  const key = getSocketKey(userId);

  await redisService.sRem(key, socketId);

  const socketCount = await redisService.sCard(key);

  if (socketCount === 0) {
    await redisService.delete(key);
  }
};

/**
 * Get all active sockets for a user
 */
export const getUserSockets = async (
  userId: string
): Promise<string[]> => {
  return redisService.sMembers(getSocketKey(userId));
};

/**
 * Check if user is online
 */
export const isUserOnline = async (
  userId: string
): Promise<boolean> => {
  const sockets = await getUserSockets(userId);

  return sockets.length > 0;
};