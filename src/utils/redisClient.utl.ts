import Redis from "ioredis";

/**
 * Redis client instance configured with environment variables.
 * Listens for connection errors and logs them to the console.
 */
export const redisClient = new Redis({
  username: process.env.REDIS_USERNAME!,
  password: process.env.REDIS_PASSWORD!,
  host: process.env.REDIS_HOST!,
  port: parseInt(process.env.REDIS_PORT!)
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
