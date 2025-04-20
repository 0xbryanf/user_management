import { loadSchemaModel } from "utils/loadSchemaModel";

export const checkUserId = async (userId: string) => {
  const UsersModel = await loadSchemaModel("User_Management", "Users");

  const user = await UsersModel.findOne({
    where: { user_id: userId },
    raw: true
  });

  if (!user) {
    return {
      status: 404,
      message: "User not found"
    };
  }

  return {
    status: 200,
    message: "User found",
    data: user
  };
};
