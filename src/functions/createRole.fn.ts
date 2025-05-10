import { findOneCredential } from "lib/helpers/findOneCredential";
import { RoleHelper } from "lib/helpers/Role";
import { Op } from "sequelize";
import { ReturnResponse } from "types/returnResponse";
import { Role, RoleResponse } from "types/roleInterfaces";
import { loadSchemaModel } from "schema/loadSchemaModel.utl";

/**
 * Creates a new role with specific permissions and validations.
 *
 * @param values - Contains role_name and created_by.
 * @returns A promise resolving to a ReturnResponse with the created role or an error.
 */
export const createRole = async (
  values: Role
): Promise<ReturnResponse<RoleResponse>> => {
  try {
    const { role_name, created_by } = values;

    if (!role_name || !created_by) {
      return {
        status: 400,
        statusText: "Bad Request",
        message: "Missing information to create a role."
      };
    }

    const UserRolesModel = await loadSchemaModel(
      "User_Management",
      "UserRoles"
    );
    if (!UserRolesModel) {
      return {
        status: 503,
        statusText: "Service Unavailable",
        message: "Failed to load UserRoles model."
      };
    }

    const user = await findOneCredential({ userId: created_by });
    if (!user) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "User not found."
      };
    }

    const existingRole = await RoleHelper.findOne(role_name);
    if (existingRole) {
      return {
        status: 409,
        statusText: "Conflict",
        message: "Role already exists."
      };
    }

    const privilegedRoles = await RoleHelper.privilegedRoles();
    const privilegedRoleIds = privilegedRoles.map((role) => role.role_id);

    const userHasPermission = await UserRolesModel.count({
      where: {
        user_id: created_by,
        role_id: { [Op.in]: privilegedRoleIds }
      }
    });

    if (userHasPermission === 0) {
      return {
        status: 403,
        statusText: "Forbidden",
        message: "You do not have permission to create roles."
      };
    }

    const newRole = await RoleHelper.createRole({ role_name, created_by });

    return {
      status: 201,
      statusText: "Created",
      message: "Role created successfully.",
      data: newRole
    };
  } catch (error) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        (error as Error).message ||
        "An unexpected error occurred during role creation."
    };
  }
};
