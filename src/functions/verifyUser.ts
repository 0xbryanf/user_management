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
export const verifyUser = async (
  values: VerifyUser
): Promise<ReturnResponse<string>> => {
  try {
    const { email, password } = values;

    if (!email || !password) {
      return {
        status: 400,
        message: "Missing email or password."
      };
    }

    const user = await findOneCredential({ email });
    if (!user) {
      return {
        status: 404,
        message: "User not found."
      };
    }

    const isPasswordValid = await verifyPassword(user.password_hash, password);
    if (!isPasswordValid) {
      return {
        status: 401,
        message: "Invalid credentials."
      };
    }

    return {
      status: 200,
      message: "User verified successfully.",
      data: user.user_id
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error verifying user."
    };
  }
};
