import { Password } from "types/password";
import { loadSchemaModel } from "schema/loadSchemaModel.utl";
import { hashPassword } from "./hashPassword";
import { ReturnResponse } from "types/returnResponse";
import * as argon2 from "argon2";
import { Op } from "sequelize";

/**
 * Utility class for password creation, storage, and verification.
 */
class Passwords {
  /**
   * Hashes and returns a new password string.
   * @param password - The plain text password.
   * @returns Promise resolving to the hashed password.
   * @throws If password is missing or model fails to load.
   */
  static async createPassword({ password }: Password): Promise<string> {
    if (!password) {
      throw new Error(`Missing information to create password.`);
    }
    const CredentialsModel = await loadSchemaModel(
      "User_Management",
      "Credentials"
    );
    if (!CredentialsModel) {
      throw new Error("Failed to load Credentials model.");
    }

    const password_hash = hashPassword(password);
    return password_hash;
  }

  /**
   * Stores a hashed password in the password history.
   * @param user_id - The user's unique identifier.
   * @param credential_id - The related credential ID.
   * @param password_hash - The hashed password.
   * @param created_by - The user who created the password.
   * @returns Promise resolving to a response indicating result.
   * @throws If required information is missing or model fails to load.
   */
  static async storePassword({
    user_id,
    credential_id,
    password_hash,
    created_by
  }: Password): Promise<ReturnResponse> {
    if (!user_id || !credential_id || !password_hash || !created_by) {
      throw new Error(`Missing information to store password.`);
    }
    const PasswordHistoryModel = await loadSchemaModel(
      "User_Management",
      "PasswordHistory"
    );
    if (!PasswordHistoryModel) {
      throw new Error("Failed to load Credentials model.");
    }
    const storedPassword = await PasswordHistoryModel.create({
      user_id,
      credential_id,
      password_hash,
      created_by,
      updated_by: created_by
    });

    if (!storedPassword) {
      throw new Error("Failed to store the password");
    }
    return {
      status: 201,
      statusText: "Created",
      message: "New password stored successfully."
    };
  }

  /**
   * Checks if the given password matches any recent passwords for the user.
   * @param user_id - The user's unique identifier.
   * @param password - The plain text password to check.
   * @returns Promise resolving to true if a match is found, otherwise false.
   * @throws If required information is missing or model fails to load.
   */
  static async findMatchingPassword({
    user_id,
    password
  }: {
    user_id: string;
    password: string;
  }): Promise<boolean> {
    if (!password || !user_id) {
      throw new Error(`Missing information to retrieve matching password.`);
    }

    const PasswordHistoryModel = await loadSchemaModel(
      "User_Management",
      "PasswordHistory"
    );

    if (!PasswordHistoryModel) {
      throw new Error("Failed to load PasswordHistory model.");
    }

    const passwordHistory = await PasswordHistoryModel.findAll({
      where: {
        user_id: user_id,
        created_at: {
          [Op.gte]: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
        }
      },
      order: [["created_at", "DESC"]]
    });

    for (const record of passwordHistory) {
      const isMatch = await argon2.verify(
        record.dataValues.password_hash,
        password
      );
      if (isMatch) {
        return true;
      }
    }

    return false;
  }
}

export { Passwords };
