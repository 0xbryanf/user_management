import { loadSchemaModel } from "utils/loadSchemaModel";

export const createRole = async (values: any) => {
  const { role_name, created_by } = values;

  // Validate required fields
  if (!role_name || !created_by) {
    return {
      status: 401,
      message: "All required fields must be provided to create a role."
    };
  }

  // Load models
  const UserManagementUsersModel = await loadSchemaModel(
    "User_Management",
    "Users"
  );
  const UserManagementRolesModel = await loadSchemaModel(
    "User_Management",
    "Roles"
  );

  const user = await UserManagementUsersModel.findOne({
    where: { user_id: created_by },
    raw: true
  });

  if (!user) {
    return {
      status: 404,
      message: "User not found."
    };
  }

  // Check user permissions
  if (user && "role" in user) {
    if (user.role !== "admin" && user.role !== "owner") {
      return {
        status: 403,
        message: "You do not have permission to create roles."
      };
    }
  }

  // Check if role already exists
  const existingRole = await UserManagementRolesModel.findOne({
    where: { role_name },
    raw: true
  });

  if (existingRole) {
    return {
      status: 409,
      message: "Role already exists."
    };
  }

  // Create new role
  const newRole = await UserManagementRolesModel.create({
    role_name,
    created_by
  });

  return {
    status: 201,
    message: "Role created successfully.",
    data: newRole
  };
};
