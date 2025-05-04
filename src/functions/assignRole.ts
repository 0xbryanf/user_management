import { findOneCredential } from "lib/helpers/findOneCredential";
import { RoleHelper } from "lib/helpers/Role";
import { ReturnResponse } from "types/returnResponse";
import { Role } from "types/roleInterfaces";
import { UserRoleResponse } from "types/userRolesInterfaces";
import { loadSchemaModel } from "utils/loadSchemaModel";

/**
 * Assigns a role to a user based on provided role details.
 *
 * @param {Role} values - The role assignment details including email, role name, and creator.
 * @returns {Promise<ReturnResponse<UserRoleResponse>>} A promise resolving to the result of role assignment.
 */
export const assignRole = async (
  values: Role
): Promise<ReturnResponse<UserRoleResponse>> => {
  try {
    const { email, role_name, created_by } = values;

    if (!email || !role_name || !created_by) {
      return {
        status: 401,
        message: "All required fields must be provided to assign a role."
      };
    }

    const UserRolesModel = await loadSchemaModel(
      "User_Management",
      "UserRoles"
    );
    if (!UserRolesModel) {
      return {
        status: 500,
        message: "Failed to load UserRoles model."
      };
    }

    const user = await findOneCredential({ email });
    if (!user) {
      return {
        status: 404,
        message: "User not found."
      };
    }

    const availableRole = await RoleHelper.findOne(role_name);
    if (!availableRole) {
      return {
        status: 404,
        message: "Role not found."
      };
    }

    const existingUserRole = await UserRolesModel.findOne({
      where: {
        user_id: user.user_id,
        role_id: availableRole.role_id
      },
      raw: true
    });

    if (existingUserRole) {
      return {
        status: 409,
        message: "User already has the assigned role."
      };
    }

    const newUserRole = await UserRolesModel.create({
      user_id: user.user_id,
      role_id: availableRole.role_id,
      created_by
    });

    return {
      status: 200,
      message: "Role assigned successfully.",
      data: newUserRole.get({ plain: true }) as UserRoleResponse
    };
  } catch (error) {
    return {
      status: 500,
      message:
        (error as Error).message ||
        "An unexpected error occurred during role assignment."
    };
  }
};
