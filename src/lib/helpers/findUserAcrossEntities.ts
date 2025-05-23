import { loadSchemaModel } from "schema/loadSchemaModel.utl";
import { Identifier } from "types/identifier";

export const findUserAcrossEntities = async (
  identifier: Identifier
): Promise<any | null> => {
  if (!identifier.email && !identifier.userId) {
    throw new Error("Either email or userId must be provided.");
  }

  const [CredentialsModel, OAuthProvidersModel, UsersModel, UserRolesModel] =
    await Promise.all([
      loadSchemaModel("User_Management", "Credentials"),
      loadSchemaModel("User_Management", "OAuthProviders"),
      loadSchemaModel("User_Management", "Users"),
      loadSchemaModel("User_Management", "UserRoles")
    ]);

  if (
    !CredentialsModel ||
    !OAuthProvidersModel ||
    !UsersModel ||
    !UserRolesModel
  ) {
    throw new Error("Failed to load models.");
  }

  const credentialsWhere: { email?: string; user_id?: string } = {
    ...(identifier.email && { email: identifier.email }),
    ...(identifier.userId && { user_id: identifier.userId })
  };

  const oauthWhere: { email?: string; user_id?: string } = {
    ...(identifier.email && { email: identifier.email }),
    ...(identifier.userId && { user_id: identifier.userId })
  };

  const [credentialUser, oauthUser] = await Promise.all([
    CredentialsModel.findOne({
      where: credentialsWhere,
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
      ]
    }),
    OAuthProvidersModel.findOne({
      where: oauthWhere,
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
      ]
    })
  ]);

  const user = credentialUser || oauthUser;
  return user ? user.get({ plain: true }) : null;
};
