import { RedisValue } from "types/redisValue";
import { redisClient } from "utils/redisClient.utl";

/**
 * A helper class for interacting with Redis.
 * Provides static methods to set, get, check TTL, and delete keys.
 */
class RedisHelper {
  /**
   * Sets a key-value pair in Redis with an optional expiration.
   */
  static async set<T>({
    key,
    data,
    expiration
  }: RedisValue<T>): Promise<string> {
    if (!key || typeof expiration !== "number") {
      throw new Error("Missing or invalid parameters for setting Redis value.");
    }

    const serializedData =
      typeof data === "object" ? JSON.stringify(data) : String(data);

    return redisClient.set(key, serializedData, "EX", expiration);
  }

  /**
   * Retrieves the value associated with a Redis key.
   */
  static async get(key: string): Promise<string> {
    if (!key) {
      throw new Error("Key is required to get Redis value.");
    }
    const response = await redisClient.get(key);
    if (response === null) {
      throw new Error("Key not found in Redis.");
    }
    return response;
  }

  /**
   * Retrieves the TTL (time to live) for a Redis key.
   *
   * @param key - The Redis key to check.
   * @returns The TTL value in seconds. -1 means no expiration, -2 means key does not exist.
   * @throws Will throw an error if the key is missing or does not exist.
   */
  static async ttl(key: string): Promise<number> {
    if (!key) {
      throw new Error("Key is required to get TTL value.");
    }
    const response = await redisClient.ttl(key);
    if (response === -2) {
      throw new Error("Key does not exist.");
    }
    return response;
  }

  /**
   * Deletes a key from Redis.
   *
   * @param key - The Redis key to delete.
   * @returns The number of keys that were removed (should be 1).
   * @throws Will throw an error if the key is missing or not found.
   */
  static async del(key: string): Promise<number> {
    if (!key) {
      throw new Error("Key is required to delete the Redis value.");
    }
    const response = await redisClient.del(key);
    if (response === 0) {
      throw new Error("Key did not exist or was not deleted.");
    }
    return response;
  }
}

export { RedisHelper };
