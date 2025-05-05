import { assignRole } from "functions/assignRole";
import { createRole } from "functions/createRole";
import { ReturnResponse } from "types/returnResponse";
import { Role, RoleResponse } from "types/roleInterfaces";
import { UserRoleResponse } from "types/userRolesInterfaces";

class RolesService {
  /**
   * Creates a new role
   * @param role_name The name of the role to create
   * @param created_by The user creating the role
   * @returns A promise with the result of role creation
   */
  static async createRole({
    role_name,
    created_by
  }: Role): Promise<ReturnResponse<RoleResponse>> {
    const result = await createRole({ role_name, created_by });
    return result;
  }

  /**
   * Assigns a role to a user
   * @param email The email of the user to assign the role to
   * @param role_name The name of the role to assign
   * @param created_by The user creating the role assignment
   * @returns A promise with the result of the role assignment
   */
  static async assignRole({
    email,
    role_name,
    created_by
  }: Role): Promise<ReturnResponse<UserRoleResponse>> {
    const result = await assignRole({ email, role_name, created_by });
    return result;
  }
}

export { RolesService };
