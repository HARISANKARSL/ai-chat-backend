import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { redisService } from "../redis/service.js";

export const rateLimit = (
  prefix: string,
  maxRequests: number,
  windowInSeconds: number
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ip =
        req.ip ||
        req.socket.remoteAddress ||
        "unknown";

      const key = `${prefix}:${ip}`;

      const count =
        await redisService.increment(key);

      if (count === 1) {
        await redisService.expire(
          key,
          windowInSeconds
        );
      }

      const ttl =
        await redisService.ttl(key);

      res.setHeader(
        "X-RateLimit-Limit",
        maxRequests
      );

      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(
          0,
          maxRequests - count
        )
      );

      res.setHeader(
        "X-RateLimit-Reset",
        ttl
      );

      if (count > maxRequests) {
        return res.status(429).json({
          success: false,
          message:
            "Too many requests. Please try again later.",
          showToast: true,
          retryAfter: ttl,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};