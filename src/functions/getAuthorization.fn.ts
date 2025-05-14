import { RedisHelper } from "lib/helpers/Redis";
import { Authorization } from "types/authorization";
import { ReturnResponse } from "types/returnResponse";

export const getAuthorization = async ({
  key
}: {
  key: string;
}): Promise<ReturnResponse<Authorization>> => {
  if (!key) {
    return {
      status: 400,
      statusText: "Bad Request",
      message: "A key is required to fetch the authorization data."
    };
  }

  try {
    const redisResponse = await RedisHelper.get(key);

    if (!redisResponse) {
      return {
        status: 503,
        statusText: "Service Unavailable",
        message: "Unable to fetch authorization data from the service."
      };
    }

    return {
      status: 200,
      statusText: "Success",
      message: "Authorization data retrieved successfully.",
      data: JSON.parse(redisResponse)
    };
  } catch (error: unknown) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while retrieving authorization data."
    };
  }
};
