import { hashPassword } from "lib/helpers/hashPassword";
import { CreateUser } from "types/createUser";
import { loadSchemaModel } from "utils/loadSchemaModel";

export const createUser = async (values: CreateUser) => {
  const { username, email, password } = values;

  if (!username || !email || !password) {
    return {
      status: 404,
      message: "All required fields must be provided to create a user."
    };
  }

  const UsersModel = await loadSchemaModel("User_Management", "Users");
  const RolesModel = await loadSchemaModel("User_Management", "Roles");
  const UserRolesModel = await loadSchemaModel("User_Management", "UserRoles");

  // Check if the models were successfully loaded
  if (!UsersModel || !RolesModel || !UserRolesModel) {
    throw new Error("Failed to load models.");
  }

  const defaultRole = await RolesModel.findOne({
    where: { role_name: "reader" }
  });

  if (!defaultRole) {
    return {
      status: 404,
      message: "Default role 'reader' not found."
    };
  }

  // Hash the password before creating the user
  const password_hash = await hashPassword(password);

  const newUser = await UsersModel.create({
    username,
    email,
    password_hash
  });

  await UserRolesModel.create({
    user_id: newUser.dataValues.user_id,
    role_id: defaultRole.dataValues.role_id
  });

  const userWithRole = await UserRolesModel.findOne({
    where: { user_id: newUser.dataValues.user_id },
    include: [
      {
        attributes: ["user_id", "username", "email", "created_at"],
        model: UsersModel,
        as: "user"
      },
      {
        model: RolesModel,
        as: "role"
      }
    ]
  });

  return {
    status: 201,
    message: "User created successfully.",
    data: userWithRole
  };
};
