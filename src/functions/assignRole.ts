import { loadSchemaModel } from "utils/loadSchemaModel";

interface AssignRoleInput {
  email_address: string;
  role_name: string;
  created_by: string;
}

export const assignRole = async (values: AssignRoleInput) => {
  const { email_address, role_name, created_by } = values;

  if (!email_address || !role_name || !created_by) {
    return {
      status: 401,
      message: "All required fields must be provided to assign a role."
    };
  }

  const [UsersModel, RolesModel, UserRolesModel] = await Promise.all([
    loadSchemaModel("User_Management", "Users"),
    loadSchemaModel("User_Management", "Roles"),
    loadSchemaModel("User_Management", "UserRoles")
  ]);

  const user: any = await UsersModel.findOne({
    where: { email: email_address },
    raw: true
  });

  if (!user) {
    return {
      status: 404,
      message: "User not found."
    };
  }

  const availableRole: any = await RolesModel.findOne({
    where: { role_name },
    raw: true
  });

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
      status: 400,
      message: "User already has this role."
    };
  }

  const newUserRole = await UserRolesModel.create({
    user_id: user.user_id,
    role_id: availableRole.role_id,
    created_by: created_by
  });

  return {
    status: 200,
    message: "Role assigned successfully.",
    data: newUserRole
  };
};
