import { verifyPassword } from "lib/helpers/verifyPassword";
import { Op } from "sequelize";
import { loadSchemaModel } from "utils/loadSchemaModel";

export interface VerifyUser {
  account: string;
  password: string;
}

export const verifyUser = async (values: VerifyUser) => {
  const { account, password } = values;

  if (!account || !password) {
    return {
      status: 404,
      message: "All required fields must be provided to verify a user."
    };
  }

  const UsersModel = await loadSchemaModel("User_Management", "Users");

  const user = await UsersModel.findOne({
    where: {
      [Op.or]: [{ username: account }, { email: account }]
    }
  });

  if (!user) {
    return {
      status: 404,
      message: "User not verified."
    };
  }

  const isPasswordValid = await verifyPassword(
    user.dataValues.password_hash,
    password
  );

  if (!isPasswordValid) {
    return {
      status: 401,
      message: "User not verified.",
      data: isPasswordValid
    };
  }

  return {
    status: 200,
    message: "User verified successfully.",
    data: isPasswordValid
  };
};
