import { Password } from "types/password";
import { loadSchemaModel } from "utils/loadSchemaModel.utl";
import { hashPassword } from "./hashPassword";

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
      throw new Error("Failed to load Roles model.");
    }

    const password_hash = hashPassword(password);
    return password_hash;
  }
}

export { Passwords };
