import { UserRole, UserRoleResponse } from "types/userRolesInterfaces";
import { loadSchemaModel } from "schema/loadSchemaModel.utl";

/**
 * Assigns a role to a user in the database.
 *
 * @param user - Object containing user_id, role_id, and optionally created_by.
 * @returns A plain object representing the created user-role assignment.
 * @throws If the model loading or creation fails.
 */
export const createUserRoles = async ({
  user_id,
  role_id,
  created_by
}: UserRole): Promise<UserRoleResponse> => {
  if (!user_id || !role_id) {
    throw new Error("user_id and role_id are required.");
  }

  const UserRolesModel = await loadSchemaModel("User_Management", "UserRoles");
  if (!UserRolesModel) {
    throw new Error("Failed to load User Roles model.");
  }

  const userRole = await UserRolesModel.create({
    user_id,
    role_id,
    created_by: created_by ?? user_id
  });

  return userRole.get({ plain: true }) as UserRoleResponse;
};
