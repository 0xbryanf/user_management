import { findOneCredential } from "lib/helpers/findOneCredential";
import { CredentialResponse } from "types/credentialInterfaces";
import { ReturnResponse } from "types/returnResponse";

/**
 * Retrieves a user's credential information by email.
 *
 * @param values - Object containing the email address to search for.
 * @returns A response containing the user data or an error message.
 */
export const getUserByEmail = async (values: {
  email: string;
}): Promise<ReturnResponse<CredentialResponse>> => {
  try {
    const { email } = values;

    if (!email) {
      return {
        status: 400,
        message: "Email must be provided."
      };
    }

    const user = await findOneCredential({ email });

    if (!user) {
      return {
        status: 404,
        message: "User not found."
      };
    }

    return {
      status: 200,
      message: "User found",
      data: user
    };
  } catch (error) {
    return {
      status: 500,
      message:
        (error as Error).message ||
        "An unexpected error occurred while retrieving the user."
    };
  }
};
