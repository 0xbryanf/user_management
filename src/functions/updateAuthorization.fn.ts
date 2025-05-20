import { RedisHelper } from "lib/helpers/Redis";
import { Authorization } from "types/authorization";
import { ReturnResponse } from "types/returnResponse";

export const updateAuthorization = async (values: {
  authData: Authorization;
}): Promise<ReturnResponse> => {
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
    expiration: authData.expiration,
    isActive: authData.isActive,
    roles: authData.roles
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
        message: "Failed to update authorization in Redis."
      };
    }

    return {
      status: 202,
      statusText: "Updated",
      message: "Authorization updated successfully."
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
