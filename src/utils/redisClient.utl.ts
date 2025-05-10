import Redis from "ioredis";

export const redisClient = new Redis({
  username: process.env.REDIS_USERNAME!,
  password: process.env.REDIS_PASSWORD!,
  host: process.env.REDIS_HOST!,
  port: parseInt(process.env.REDIS_PORT!)
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
