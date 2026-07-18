import { redisClient } from "./redis.js";

class RedisService {
  /**
   * Set a value
   */
  async set(
    key: string,
    value: string,
    ttlInSeconds?: number
  ): Promise<void> {
    try {
      if (ttlInSeconds !== undefined) {
        await redisClient.set(key, value, {
          EX: ttlInSeconds,
        });
      } else {
        await redisClient.set(key, value);
      }
    } catch (error) {
      console.error("Redis SET Error:", error);
      throw error;
    }
  }

  /**
   * Get a value
   */
  async get(
    key: string
  ): Promise<string | null> {
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.error("Redis GET Error:", error);
      throw error;
    }
  }

  /**
   * Delete a key
   */
  async delete(
    key: string
  ): Promise<number> {
    try {
      return await redisClient.del(key);
    } catch (error) {
      console.error("Redis DELETE Error:", error);
      throw error;
    }
  }

  /**
   * Check if key exists
   */
  async exists(
    key: string
  ): Promise<boolean> {
    try {
      const result =
        await redisClient.exists(key);

      return result === 1;
    } catch (error) {
      console.error(
        "Redis EXISTS Error:",
        error
      );
      throw error;
    }
  }

  /**
   * Set expiry
   */
  async expire(
    key: string,
    ttlInSeconds: number
  ): Promise<void> {
    try {
      await redisClient.expire(
        key,
        ttlInSeconds
      );
    } catch (error) {
      console.error(
        "Redis EXPIRE Error:",
        error
      );
      throw error;
    }
  }

  /**
   * Increment a key
   */
  async increment(
    key: string
  ): Promise<number> {
    try {
      return await redisClient.incr(key);
    } catch (error) {
      console.error(
        "Redis INCR Error:",
        error
      );
      throw error;
    }
  }

  /**
   * Get TTL
   */
  async ttl(
    key: string
  ): Promise<number> {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      console.error(
        "Redis TTL Error:",
        error
      );
      throw error;
    }
  }

  /**
   * Delete all keys matching a pattern
   */
  async deleteByPattern(
    pattern: string
  ): Promise<number> {
    try {
      const keys =
        await redisClient.keys(pattern);

      if (keys.length === 0) {
        return 0;
      }

      return await redisClient.del(keys);
    } catch (error) {
      console.error(
        "Redis Pattern Delete Error:",
        error
      );
      throw error;
    }
  }
}

export const redisService =
  new RedisService();