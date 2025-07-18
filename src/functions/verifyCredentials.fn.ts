import { findOneCredential } from "lib/helpers/findOneCredential";
import { verifyPassword } from "lib/helpers/verifyPassword";
import { ReturnResponse } from "types/returnResponse";
import { VerifyUser } from "types/verifyUser";
import { generateToken } from "utils/generateToken.utl";

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

    const token: string = generateToken(user.user_id);

    return {
      status: 202,
      statusText: "Accepted",
      message: "User verified successfully.",
      data: Buffer.from(token).toString("base64")
    };
  } catch (error) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message: "Error verifying user."
    };
  }
};
