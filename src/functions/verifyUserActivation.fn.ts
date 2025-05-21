import { UserHelper } from "lib/helpers/Users";
import { ReturnResponse } from "types/returnResponse";
/**
 * Verifies if a user is active based on their user ID.
 *
 * @param values - Object containing the `user_id`.
 * @returns Promise resolving to a standardized response with activation status or error.
 */
export const verifyUserActivation = async (values: {
  user_id: string;
}): Promise<ReturnResponse<boolean>> => {
  try {
    if (!values.user_id) {
      return {
        status: 400,
        statusText: "Bad Request",
        message: "Missing user_id."
      };
    }

    const isActive = await UserHelper.VerifyIsActive(values.user_id);
    if (isActive === undefined || isActive === null) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "User not found."
      };
    }

    return {
      status: 200,
      statusText: "Success",
      message: `User is ${isActive ? "active" : "not active"}.`,
      data: isActive
    };
  } catch (error) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message: "Error verifying user."
    };
  }
};
