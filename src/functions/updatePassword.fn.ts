import { findOneCredential } from "lib/helpers/findOneCredential";
import { Passwords } from "lib/helpers/Password";
import { Password } from "types/password";
import { ReturnResponse } from "types/returnResponse";
import { loadSchemaModel } from "schema/loadSchemaModel.utl";

/**
 * Updates a user's password with secure validation and reuse prevention.
 *
 * @param values - Contains password and created_by (user ID).
 * @returns A promise resolving to a ReturnResponse with the update status or an error.
 */
export const updatePassword = async (
  values: Password
): Promise<ReturnResponse> => {
  try {
    const { password, created_by } = values;

    // Validate input values
    if (!password || !created_by) {
      return {
        status: 400,
        statusText: "Bad Request",
        message: "Password and created_by are required."
      };
    }

    // Load Credentials Model
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

    // Find the user credential by user ID
    const credential = await findOneCredential({ userId: created_by });
    if (!credential) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "User credential not found."
      };
    }

    // Create the hashed password
    const password_hash = await Passwords.createPassword({ password });

    // Check if the password has already been used
    const isExisting = await Passwords.findMatchingPassword({
      user_id: credential.user_id,
      password
    });
    if (isExisting) {
      return {
        status: 409,
        statusText: "Conflict",
        message: "This password has already been used. Please use a new one."
      };
    }

    // Update the password in the Credentials table
    const [affectedCount] = await CredentialsModel.update(
      {
        password_hash,
        updated_by: created_by,
        updated_at: new Date()
      },
      {
        where: { user_id: credential.user_id }
      }
    );

    // Confirm if the update was successful
    if (affectedCount === 0) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "Failed to update the password."
      };
    }

    // Store the updated password in PasswordHistory
    await Passwords.storePassword({
      user_id: credential.user_id,
      credential_id: credential.credential_id,
      password_hash,
      created_by
    });

    // Return success response
    return {
      status: 200,
      statusText: "OK",
      message: "Password updated successfully."
    };
  } catch (error) {
    console.error("Error updating password:", error);

    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        (error as Error).message ||
        "An unexpected error occurred while updating the password."
    };
  }
};
