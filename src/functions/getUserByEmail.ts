import { findOneCredential } from "lib/helpers/findOneCredential";
import { CredentialResponse } from "types/credentialResponse";
import { ReturnResponse } from "types/returnResponse";

/**
 * Retrieves a user credential by their email address.
 *
 * This function checks if the email is provided, then queries for the user using the provided email.
 * It returns a structured response including HTTP status, message, and user data if found.
 *
 * @param values - An object containing the email address to search for.
 * @param values.email - The email address of the user to retrieve.
 *
 * @returns A `ReturnResponse` object containing:
 * - `status`: HTTP status code (e.g., 200, 400, 404)
 * - `message`: Description of the operation result
 * - `data` (optional): The `CredentialResponse` object if the user was found
 * }
 */
export const getUserByEmail = async (values: {
  email: string;
}): Promise<ReturnResponse<CredentialResponse>> => {
  const { email } = values;
  if (!email) {
    return {
      status: 400,
      message: "Email must be provided."
    };
  }
  const user: CredentialResponse | null = await findOneCredential({ email });
  if (!user) {
    return {
      status: 404,
      message: "User not found."
    };
  }
  return {
    status: 200,
    message: "User found",
    data: user as CredentialResponse
  };
};
