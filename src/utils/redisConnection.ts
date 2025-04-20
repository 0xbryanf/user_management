import { redisClient } from "utils/redisClient";

let isInitialized = false;

export const checkRedisConnection = async (): Promise<boolean> => {
  try {
    const result = await redisClient.ping();
    return result === "PONG";
  } catch {
    return false;
  }
};

export const redisConnectionUp = async (): Promise<void> => {
  if (isInitialized) return;

  redisClient.once("connect", () => {
    console.log("Connected to Redis");
  });

  redisClient.once("error", (error) => {
    console.error("Redis connection error:", error);
  });

  await new Promise<void>((resolve) => {
    redisClient.once("ready", () => {
      isInitialized = true;
      resolve();
    });
  });
};

export const redisConnectionDown = async (): Promise<void> => {
  if (!isInitialized) return;

  await redisClient.quit();
  isInitialized = false;
  console.log("Redis connection closed");
};
