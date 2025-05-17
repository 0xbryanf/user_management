import { RedisHelper } from "lib/helpers/Redis";
import { Authorization } from "types/authorization";
import { ReturnResponse } from "types/returnResponse";

export const activateAuthorization = async ({
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
    const data = await RedisHelper.get(key);
    if (!data) {
      return {
        status: 503,
        statusText: "Service Unavailable",
        message: "Unable to fetch authorization data from the service."
      };
    }

    const ttl = await RedisHelper.ttl(key);
    const parsedData = JSON.parse(data);
    const updatedData = { ...parsedData, isAuthorize: true, expiration: ttl };

    await RedisHelper.set({
      key,
      data: updatedData,
      expiration: ttl
    });

    return {
      status: 200,
      statusText: "Success",
      message: "Authorization data activated successfully.",
      data: updatedData
    };
  } catch (error: unknown) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while activating authorization data."
    };
  }
};
