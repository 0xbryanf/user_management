import { CredentialResponse } from "types/credentialResponse";
import { Identifier } from "types/identifier";
import { loadSchemaModel } from "utils/loadSchemaModel";

/**
 * Finds a user credential record by either email or user ID.
 *
 * Loads the required schema models and searches for a matching record
 * in the `Credentials` model. Includes associated user and role data.
 *
 * @param identifier - An object containing either `email` or `userId` to filter the credential record.
 * @returns A `CredentialResponse` object with related user data, or `null` if no match is found.
 *
 * @throws Will throw an error if any of the required models fail to load.
 */
export const findOneCredential = async (
  identifier: Identifier
): Promise<CredentialResponse | null> => {
  const CredentialsModel = await loadSchemaModel(
    "User_Management",
    "Credentials"
  );
  const UsersModel = await loadSchemaModel("User_Management", "Users");
  const UserRolesModel = await loadSchemaModel("User_Management", "UserRoles");
  if (!CredentialsModel || !UsersModel || !UserRolesModel) {
    throw new Error("Failed to load models.");
  }
  const whereClause: { email?: string; user_id?: string } = {};
  if (identifier.email) whereClause.email = identifier.email;
  if (identifier.userId) whereClause.user_id = identifier.userId;

  const user = await CredentialsModel.findOne({
    where: whereClause,
    include: [
      {
        model: UsersModel,
        as: "user",
        include: [
          {
            model: UserRolesModel,
            as: "userRoles"
          }
        ]
      }
    ],
    raw: true
  });

  return user as CredentialResponse | null;
};
