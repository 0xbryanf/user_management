import { hashPassword } from "lib/helpers/hashPassword";
// import { generateToken } from "utils/generateToken";
import { loadSchemaModel } from "utils/loadSchemaModel";
import { v4 as UUIDV4 } from "uuid";
import { findOneCredential } from "lib/helpers/findOneCredential";
import { findOneRole } from "lib/helpers/findOneRole";
import { RolesEnum } from "utils/rolesEnum";
import { RegisterCredentialsInitUser } from "types/registerCredentialsInitUser";
import { requestEmailConfirmation } from "./requestEmailConfirmation";
import { createUser } from "lib/helpers/createUser";
import { UserResponse } from "types/userInterfaces";

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
  const UserRolesModel = await loadSchemaModel("User_Management", "UserRoles");
  if (!CredentialsModel || !UsersModel || !UserRolesModel) {
    throw new Error("Failed to load models.");
  }
  const userId = UUIDV4();
  const password_hash = await hashPassword(values.password);
  const defaultRole = await findOneRole(RolesEnum.READER);
  if (!defaultRole) {
    return {
      status: 404,
      message: "Default role 'reader' not found."
    };
  }
  const existingUser = await findOneCredential({ email: values.email });
  if (existingUser) {
    await requestEmailConfirmation({ email: values.email });
    return {
      status: 409,
      message: "User already exists."
    };
  }
  const newUser: UserResponse = await createUser({
    user_id: userId,
    created_by: userId
  });

  await CredentialsModel.create({
    user_id: newUser.user_id,
    email: values.email,
    password_hash: password_hash,
    created_by: values.createdBy ? values.createdBy : userId
  });

  // await UserRolesModel.create({
  //   user_id: newUser.dataValues.user_id,
  //   role_id: defaultRole.dataValues.role_id,
  //   created_by: values.createdBy ? values.createdBy : userId
  // });

  // const token = generateToken(newUser.dataValues.user_id);

  // const userwithToken = await UserRolesModel.findOne({
  //   where: { user_id: newUser.dataValues.user_id },
  //   include: [
  //     {
  //       attributes: ["user_id", "is_active"],
  //       model: UsersModel,
  //       as: "user"
  //     },
  //     {
  //       attributes: ["role_id", "role_name"],
  //       model: RolesModel,
  //       as: "role"
  //     }
  //   ]
  // });

  // if (!userwithToken) {
  //   return {
  //     status: 404,
  //     message: "Failed to retrieve user data after creation."
  //   };
  // }

  return {
    status: 201,
    message: "User created successfully."
    // data: {
    //   user: userwithToken.get("user"),
    //   role: userwithToken.get("role"),
    //   payloadRef: Buffer.from(token).toString("base64")
    // }
  };
};
