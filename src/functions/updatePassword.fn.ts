import { findOneCredential } from "lib/helpers/findOneCredential";
import { Passwords } from "lib/helpers/Password";
import { Password } from "types/password";
import { ReturnResponse } from "types/returnResponse";
import { loadSchemaModel } from "utils/loadSchemaModel.utl";

/**
 * Creates a new role with specific permissions and validations.
 *
 * @param values - Contains role_name and created_by.
 * @returns A promise resolving to a ReturnResponse with the created role or an error.
 */
export const updatePassword = async (
  values: Password
): Promise<ReturnResponse> => {
  try {
    const { password, created_by } = values;
    if (!password || !created_by) {
      return {
        status: 400,
        statusText: "Bad Request",
        message: "Missing information to create a password."
      };
    }

    const CredentialsModel = await loadSchemaModel(
      "User_Management",
      "Credentials"
    );
    if (!CredentialsModel) {
      return {
        status: 503,
        statusText: "Service Unavailable",
        message: "Failed to load Credentials model."
      };
    }

    const credential = await findOneCredential({ userId: created_by });
    if (!credential) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "Credential not found."
      };
    }

    const password_hash = await Passwords.createPassword({ password });

    const [affectedCount] = await CredentialsModel.update(
      {
        password_hash,
        updated_by: credential.user_id,
        updated_at: new Date()
      },
      {
        where: { user_id: credential.user_id }
      }
    );

    if (!affectedCount) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "Password not updated."
      };
    }

    return {
      status: 200,
      statusText: "Updated",
      message: "Password Updated."
    };
  } catch (error) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        (error as Error).message ||
        "An unexpected error occurred during role creation."
    };
  }
};
