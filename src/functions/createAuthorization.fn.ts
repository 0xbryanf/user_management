import { RedisHelper } from "lib/helpers/Redis";
import { Authorization } from "types/authorization";
import { ReturnResponse } from "types/returnResponse";
/**
 * Creates a new authorization record in Redis.
 *
 * @param values - Object containing `authData` for authorization.
 * @returns Promise resolving to a standardized response indicating success or error.
 */
export const createAuthorization = async (values: {
  authData: Authorization;
}): Promise<ReturnResponse<string>> => {
  const { authData } = values;
  if (!authData) {
    return {
      status: 400,
      statusText: "Bad Request",
      message: "Missing or invalid parameters for creating authorization."
    };
  }

  let data = {
    userId: authData.userId,
    authorizationToken: authData.authorizationToken,
    isAuthorize: authData.isAuthorize,
    expiration: authData.expiration
  };

  try {
    const redisResponse = await RedisHelper.set({
      key: authData.key,
      data,
      expiration: authData.expiration
    });

    if (!redisResponse) {
      return {
        status: 503,
        statusText: "Service Unavailable",
        message: "Failed to create authorization in Redis."
      };
    }

    return {
      status: 201,
      statusText: "Created",
      message: "Authorization created successfully."
    };
  } catch (error: unknown) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during authorization creation."
    };
  }
};
