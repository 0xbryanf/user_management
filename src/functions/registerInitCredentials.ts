import { hashPassword } from "lib/helpers/hashPassword";
import { RegisterCredentialsInitUser } from "types/createUser";
import { generateToken } from "utils/generateToken";
import { loadSchemaModel } from "utils/loadSchemaModel";
import { v4 as UUIDV4 } from "uuid";

export const registerInitCredentials = async (
  values: RegisterCredentialsInitUser
) => {
  if (!values.email || !values.password) {
    return {
      status: 400,
      message: "All required fields must be provided to create a user."
    };
  }

  const CredentialsModel = await loadSchemaModel(
    "User_Management",
    "Credentials"
  );
  const UsersModel = await loadSchemaModel("User_Management", "Users");
  const RolesModel = await loadSchemaModel("User_Management", "Roles");
  const UserRolesModel = await loadSchemaModel("User_Management", "UserRoles");

  if (!CredentialsModel || !UsersModel || !RolesModel || !UserRolesModel) {
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

  // ✅ Check if user already exists by username or email
  const existingUser = await CredentialsModel.findOne({
    where: { email: values.email }
  });

  if (existingUser) {
    return {
      status: 409,
      message: "User already exists."
    };
  }

  const userId = UUIDV4();
  console.log("userId: ", userId);
  const password_hash = await hashPassword(values.password);

  const newUser = await UsersModel.create({
    user_id: userId,
    is_active: false,
    created_by: userId
  });

  if (!newUser) {
    return {
      status: 409,
      message: "User identity is not present, create the user identity first."
    };
  }

  await CredentialsModel.create({
    user_id: newUser.dataValues.user_id,
    email: values.email,
    password_hash: password_hash,
    created_by: userId
  });

  await UserRolesModel.create({
    user_id: newUser.dataValues.user_id,
    role_id: defaultRole.dataValues.role_id
  });

  const token = generateToken(newUser.dataValues.user_id);

  const userwithToken = await UserRolesModel.findOne({
    where: { user_id: newUser.dataValues.user_id },
    include: [
      {
        attributes: ["user_id", "is_active"],
        model: UsersModel,
        as: "user"
      },
      {
        attributes: ["role_id", "role_name"],
        model: RolesModel,
        as: "role"
      }
    ]
  });

  if (!userwithToken) {
    return {
      status: 404,
      message: "Failed to retrieve user data after creation."
    };
  }

  return {
    status: 201,
    message: "User created successfully.",
    data: {
      user: userwithToken.get("user"),
      role: userwithToken.get("role"),
      payloadRef: Buffer.from(token).toString("base64")
    }
  };
};
