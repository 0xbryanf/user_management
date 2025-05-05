import { findOneCredential } from "lib/helpers/findOneCredential";
import { CredentialResponse } from "types/credentialInterfaces";
import { ReturnResponse } from "types/returnResponse";

/**
 * Retrieves a user by their unique user ID.
 *
 * @param values - An object containing the userId to search for.
 * @returns A response with the user's credential info or an appropriate error message.
 */
export const getUserByUserId = async (values: {
  userId: string;
}): Promise<ReturnResponse<CredentialResponse>> => {
  try {
    const { userId } = values;

    if (!userId) {
      return {
        status: 400,
        statusText: "Bad Request",
        message: "UserId must be provided."
      };
    }

    const user = await findOneCredential({ userId });

    if (!user) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "User not found."
      };
    }

    return {
      status: 200,
      statusText: "OK",
      message: "User found",
      data: user
    };
  } catch (error) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        (error as Error).message ||
        "An unexpected error occurred while retrieving the user."
    };
  }
};
