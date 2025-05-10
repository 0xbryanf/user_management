import { loadSchemaModel } from "./loadSchemaModel.utl";

export const initializeAssociations = async () => {
  // load from the lowercase schema (Postgres is case-sensitive for unquoted identifiers)
  const schema = "User_Management";

  const UsersModel = await loadSchemaModel(schema, "Users");
  const CredentialsModel = await loadSchemaModel(schema, "Credentials");
  const OAuthProvidersModel = await loadSchemaModel(schema, "OAuthProviders");
  const PasswordHistoryModel = await loadSchemaModel(schema, "PasswordHistory");
  const RolesModel = await loadSchemaModel(schema, "Roles");
  const UserRolesModel = await loadSchemaModel(schema, "UserRoles");

  if (
    !UsersModel ||
    !CredentialsModel ||
    !OAuthProvidersModel ||
    !PasswordHistoryModel ||
    !RolesModel ||
    !UserRolesModel
  ) {
    throw new Error("Failed to load models for associations.");
  }

  // --- Users <> Credentials (1:N)
  UsersModel.hasMany(CredentialsModel, {
    foreignKey: "user_id",
    as: "credentials"
  });
  CredentialsModel.belongsTo(UsersModel, {
    foreignKey: "user_id",
    as: "user"
  });

  // --- Users <> OAuthProviders (1:N)
  UsersModel.hasMany(OAuthProvidersModel, {
    foreignKey: "user_id",
    as: "oauthProviders"
  });
  OAuthProvidersModel.belongsTo(UsersModel, {
    foreignKey: "user_id",
    as: "user"
  });

  // --- Users <> PasswordHistory (1:N)
  UsersModel.hasMany(PasswordHistoryModel, {
    foreignKey: "user_id",
    as: "passwordHistory"
  });
  PasswordHistoryModel.belongsTo(UsersModel, {
    foreignKey: "user_id",
    as: "user"
  });

  // --- Credentials <> PasswordHistory (1:N)
  CredentialsModel.hasMany(PasswordHistoryModel, {
    foreignKey: "credential_id",
    as: "history"
  });
  PasswordHistoryModel.belongsTo(CredentialsModel, {
    foreignKey: "credential_id",
    as: "credential"
  });

  // --- Users <> Roles through UserRoles (M:N)
  UsersModel.hasMany(UserRolesModel, {
    foreignKey: "user_id",
    as: "userRoles"
  });
  UserRolesModel.belongsTo(UsersModel, {
    foreignKey: "user_id",
    as: "user"
  });

  RolesModel.hasMany(UserRolesModel, {
    foreignKey: "role_id",
    as: "roleUsers"
  });
  UserRolesModel.belongsTo(RolesModel, {
    foreignKey: "role_id",
    as: "role"
  });

  UsersModel.belongsToMany(RolesModel, {
    through: UserRolesModel,
    foreignKey: "user_id",
    otherKey: "role_id",
    as: "roles"
  });
  RolesModel.belongsToMany(UsersModel, {
    through: UserRolesModel,
    foreignKey: "role_id",
    otherKey: "user_id",
    as: "users"
  });

  console.log("User-management associations initialized.");
  return {
    UsersModel,
    CredentialsModel,
    OAuthProvidersModel,
    PasswordHistoryModel,
    RolesModel,
    UserRolesModel
  };
};
