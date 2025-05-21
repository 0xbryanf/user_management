import { redisClient } from "utils/redisClient.utl";

let isInitialized = false;

/**
 * Checks the current connection status of the Redis client.
 *
 * @returns {Promise<boolean>} A promise that resolves to true if the Redis client successfully responds to a ping, false otherwise.
 */
export const checkRedisConnection = async (): Promise<boolean> => {
  try {
    const result = await redisClient.ping();
    return result === "PONG";
  } catch {
    return false;
  }
};

/**
 * Establishes a connection to the Redis server and sets up event listeners.
 *
 * This function attempts to connect to the Redis server if not already initialized.
 * It sets up event listeners for connection, error, and ready states.
 * Once the connection is successfully established, it marks the connection as initialized.
 *
 * @returns {Promise<void>} A promise that resolves when the Redis connection is ready.
 */
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

/**
 * Gracefully closes the Redis connection if initialized.
 * Sets isInitialized to false after disconnecting.
 */
export const redisConnectionDown = async (): Promise<void> => {
  if (!isInitialized) return;

  await redisClient.quit();
  isInitialized = false;
  console.log("Redis connection closed");
};
