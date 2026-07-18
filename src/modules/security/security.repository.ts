import SecurityLog from "./security.model.js";
import type { SecurityLogDocument } from "./security.model.js";
import type { CreateSecurityLogInput } from "./security.types.js";

/**
 * Create Security Log
 */
export const createSecurityLog = async (
  input: CreateSecurityLogInput
): Promise<SecurityLogDocument> => {
  return SecurityLog.create(input);
};

/**
 * Get Security Logs By User
 */
export const getSecurityLogsByUser = async (
  userId: string,
  limit = 20
): Promise<SecurityLogDocument[]> => {
  return SecurityLog.find({
    userId,
  })
    .sort({
      createdAt: -1,
    })
    .limit(limit);
};

/**
 * Get All Security Logs
 */
export const getAllSecurityLogs = async (
  limit = 100
): Promise<SecurityLogDocument[]> => {
  return SecurityLog.find()
    .sort({
      createdAt: -1,
    })
    .limit(limit);
};