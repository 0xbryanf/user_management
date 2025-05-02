import { findOneCredential } from "lib/helpers/findOneCredential";
import { CredentialResponse } from "types/credentialResponse";
import { ReturnResponse } from "types/returnResponse";
/**
 * Retrieves a user credential by their user ID.
 *
 * Validates the input, attempts to find the user using the provided user ID,
 * and returns a standardized response containing the result.
 *
 * @param values - An object containing the user ID to search for.
 * @param values.userId - The unique identifier of the user.
 *
 * @returns A `ReturnResponse` object containing:
 * - `status`: HTTP status code (e.g., 200, 400, 404)
 * - `message`: Description of the operation result
 * - `data` (optional): The `CredentialResponse` if the user is found
 */
export const getUserByUserId = async (values: {
  userId: string;
}): Promise<ReturnResponse<CredentialResponse>> => {
  const { userId } = values;
  if (!userId) {
    return {
      status: 400,
      message: "UserId must be provided."
    };
  }
  const user: CredentialResponse | null = await findOneCredential({ userId });
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
