import { Op } from "sequelize";
import { CreateRoleInput } from "types/createRoleInput";
import { loadSchemaModel } from "utils/loadSchemaModel";

/**
 * Creates a new role in the system if the user has sufficient permissions.
 *
 * This function performs the following:
 * - Validates required input fields (`role_name`, `created_by`)
 * - Loads relevant models (`Users`, `Roles`, `UserRoles`)
 * - Checks if the user exists and has a privileged role (`admin`, `moderator`, or `developer`)
 * - Ensures the role name is unique
 * - Creates the new role if all checks pass
 *
 * @param values - Object containing `role_name` and `created_by` fields
 * @returns A response object containing:
 * - `status`: HTTP-like status code
 * - `message`: Description of the result
 * - `data` (optional): The created role, if successful
 */
export const createRole = async (values: CreateRoleInput) => {
  const { role_name, created_by } = values;

  if (!role_name || !created_by) {
    return {
      status: 401,
      message: "All required fields must be provided to create a role."
    };
  }

  // Load all required models in parallel
  const [UsersModel, RolesModel, UserRolesModel] = await Promise.all([
    loadSchemaModel("User_Management", "Users"),
    loadSchemaModel("User_Management", "Roles"),
    loadSchemaModel("User_Management", "UserRoles")
  ]);

  // Check if user exists and has permission in parallel with role existence check
  const [user, existingRole, privilegedRoles] = await Promise.all([
    UsersModel.findOne({ where: { user_id: created_by }, raw: true }),
    RolesModel.findOne({ where: { role_name }, raw: true }),
    RolesModel.findAll({
      where: { role_name: { [Op.in]: ["admin", "moderator", "developer"] } },
      attributes: ["role_id"],
      raw: true
    })
  ]);

  if (!user) {
    return {
      status: 404,
      message: "User not found."
    };
  }

  if (existingRole) {
    return {
      status: 409,
      message: "Role with this name already exists."
    };
  }

  const privilegedRoleIds = privilegedRoles.map((r: any) => r.role_id);

  // Check if user has permission to create a role
  const userHasPermission = await UserRolesModel.count({
    where: {
      user_id: created_by,
      role_id: { [Op.in]: privilegedRoleIds }
    }
  });

  if (userHasPermission === 0) {
    return {
      status: 403,
      message: "You do not have permission to create roles."
    };
  }

  const newRole = await RolesModel.create({ role_name, created_by });

  return {
    status: 201,
    message: "Role created successfully.",
    data: newRole
  };
};
