import { SecurityEvent } from "./security.constants.js";

export interface CreateSecurityLogInput {
  userId?: string;
  event: SecurityEvent;
  ip?: string;
  userAgent?: string;
  deviceId?: string;
  success: boolean;
  metadata?: Record<string, unknown>;
}