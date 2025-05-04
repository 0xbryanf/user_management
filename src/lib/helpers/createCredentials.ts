import { Credentials, CredentialResponse } from "types/credentialInterfaces";
import { loadSchemaModel } from "utils/loadSchemaModel";

/**
 * Creates a new user in the database.
 *
 * @param user - Object containing user_id and optionally created_by.
 * @returns A plain object representing the created user.
 * @throws If the model loading or user creation fails.
 */
export const createCredentials = async ({
  user_id,
  email,
  created_by,
  password_hash
}: Credentials): Promise<CredentialResponse> => {
  if (!user_id || !email || !password_hash) {
    throw new Error("Missing required credential fields.");
  }

  const CredentialsModel = await loadSchemaModel(
    "User_Management",
    "Credentials"
  );
  if (!CredentialsModel) {
    throw new Error("Failed to load Credentials model.");
  }

  const user = await CredentialsModel.create({
    user_id,
    email,
    password_hash,
    created_by: created_by ?? user_id
  });

  return user.get({ plain: true }) as CredentialResponse;
};
