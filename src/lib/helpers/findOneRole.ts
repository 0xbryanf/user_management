import { RoleResponse } from "types/roleResponse";
import { loadSchemaModel } from "utils/loadSchemaModel";
import { RolesEnum } from "utils/rolesEnum";
/**
 * Finds a role record by its role name (enum value).
 *
 * @param role - A value from the `Roles` enum.
 * @returns A `RoleResponse` object if found, or `null` if not found.
 * @throws If the Roles model fails to load.
 */
export const findOneRole = async (
  role: RolesEnum
): Promise<RoleResponse | null> => {
  const RolesModel = await loadSchemaModel("User_Management", "Roles");
  if (!RolesModel) {
    throw new Error("Failed to load models.");
  }
  const roleData = await RolesModel.findOne({
    where: { role_name: role },
    raw: true
  });
  return roleData as RoleResponse | null;
};
