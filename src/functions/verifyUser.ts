import { verifyPassword } from "lib/helpers/verifyPassword";
import { loadSchemaModel } from "utils/loadSchemaModel";

export interface VerifyUser {
  email: string;
  password: string;
}

export const verifyUser = async (values: VerifyUser) => {
  const { email, password } = values;

  if (!email || !password) {
    return {
      status: 404,
      message: "All required fields must be provided to verify a user."
    };
  }

  const UsersModel = await loadSchemaModel("User_Management", "Users");

  const user = await UsersModel.findOne({
    where: { email }
  });

  console.log("user: " + user);

  if (!user) {
    return {
      status: 404,
      message: "Invalid credentials"
    };
  }

  const isPasswordValid = await verifyPassword(
    user.dataValues.password_hash,
    password
  );

  if (!isPasswordValid) {
    return {
      status: 401,
      message: "Invalid credentials",
      data: isPasswordValid
    };
  }

  return {
    status: 200,
    message: "User verified successfully",
    data: isPasswordValid
  };
};
