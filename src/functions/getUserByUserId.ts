import { loadSchemaModel } from "utils/loadSchemaModel";

export const getUserByUserId = async (values: { userId: string }) => {
  const { userId } = values;
  if (!userId) {
    return {
      status: 400,
      message: "UserId must be provided."
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

  const user = await CredentialsModel.findOne({
    where: { user_id: userId },
    include: [
      {
        model: UsersModel,
        as: "user",
        include: [
          {
            model: UserRolesModel,
            as: "userRoles"
          }
        ]
      }
    ],
    raw: true
  });

  if (!user) {
    return {
      status: 404,
      message: "User not found."
    };
  }

  return {
    status: 200,
    message: "User found",
    data: user
  };
};
