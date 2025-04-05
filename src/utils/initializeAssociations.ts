import { loadSchemaModel } from "./loadSchemaModel";

export const initializeAssociations = async () => {
  const UsersModel = await loadSchemaModel("User_Management", "Users");
  const RolesModel = await loadSchemaModel("User_Management", "Roles");
  const UserRolesModel = await loadSchemaModel("User_Management", "UserRoles");

  if (!UsersModel || !RolesModel || !UserRolesModel) {
    throw new Error("Failed to load models for associations.");
  }

  UsersModel.hasMany(UserRolesModel, {
    foreignKey: "user_id",
    as: "user_roles" // Alias for UserRoles associated with Users
  });

  UserRolesModel.belongsTo(UsersModel, {
    foreignKey: "user_id",
    as: "user" // Alias for the user in UserRoles
  });

  UserRolesModel.belongsTo(RolesModel, {
    foreignKey: "role_id",
    as: "role" // Alias for the role in UserRoles
  });

  RolesModel.hasMany(UserRolesModel, {
    foreignKey: "role_id",
    as: "role_users" // Alias for UserRoles associated with Roles
  });

  UsersModel.belongsToMany(RolesModel, {
    through: UserRolesModel,
    foreignKey: "user_id",
    otherKey: "role_id",
    as: "roles" // Alias for Roles associated with Users
  });

  RolesModel.belongsToMany(UsersModel, {
    through: UserRolesModel,
    foreignKey: "role_id",
    otherKey: "user_id",
    as: "users" // Alias for Users associated with Roles
  });

  console.log("Associations initialized.");

  return {
    UsersModel,
    RolesModel,
    UserRolesModel
  };
};
