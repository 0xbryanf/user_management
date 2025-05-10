import { Password } from "types/password";
import { loadSchemaModel } from "schema/loadSchemaModel.utl";
import { hashPassword } from "./hashPassword";
import { ReturnResponse } from "types/returnResponse";
import * as argon2 from "argon2";
import { Op } from "sequelize";

class Passwords {
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
