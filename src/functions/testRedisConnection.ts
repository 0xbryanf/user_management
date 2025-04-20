import { redisClient } from "utils/redisClient";

export interface RedisInput {
  key: string;
  value: string;
}

export const testRedisConnection = async (values: RedisInput) => {
  try {
    await redisClient.set(values.key, values.value, "EX", 2 * 60);
    const result = await redisClient.get(values.key);

    // Convert both to string for comparison
    if (result === values.value) {
      return {
        status: 200,
        message: "Redis connection is working",
        data: result
      };
    } else {
      return {
        status: 500,
        message: "Error: Redis test failed, unexpected value.",
        data: result
      };
    }
  } catch (error: unknown) {
    console.error("Redis connection error:", error);
    return {
      status: 500,
      message: "Redis connection error",
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    await redisClient.quit();
  }
};
