import { findOneCredential } from "lib/helpers/findOneCredential";
import { verifyPassword } from "lib/helpers/verifyPassword";
import { ReturnResponse } from "types/returnResponse";
import { VerifyUser } from "types/verifyUser";

/**
 * Verifies a user's credentials by checking email and password.
 *
 * @param values - Object containing user's email and password.
 * @returns A response with user ID if credentials are valid, or an error message.
 */
export const verifyCredentials = async (
  values: VerifyUser
): Promise<ReturnResponse<string>> => {
  try {
    const { email, password } = values;

    if (!email || !password) {
      return {
        status: 400,
        statusText: "Bad Request",
        message: "Missing email or password."
      };
    }

    const user = await findOneCredential({ email });
    if (!user) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "User not found."
      };
    }

    const isPasswordValid = await verifyPassword(user.password_hash, password);
    if (!isPasswordValid) {
      return {
        status: 401,
        statusText: "Unauthorized",
        message: "Invalid credentials."
      };
    }

    return {
      status: 202,
      statusText: "Accepted",
      message: "User verified successfully.",
      data: user.user_id
    };
  } catch (error) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message: "Error verifying user."
    };
  }
};
