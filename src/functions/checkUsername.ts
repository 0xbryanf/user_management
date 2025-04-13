import { loadSchemaModel } from "utils/loadSchemaModel";

export const checkUsername = async (values: { username: string }) => {
  const { username } = values;

  const UsersModel = await loadSchemaModel("User_Management", "Users");

  const existingUser = await UsersModel.findOne({
    where: { username },
    raw: true
  });

  if (existingUser) {
    return {
      status: 409,
      message: "Username already exists"
    };
  }

  return {
    status: 200,
    message: "Username is available"
  };
};
