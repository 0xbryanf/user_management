import { loadSchemaModel } from "utils/loadSchemaModel";

export const getUserByEmail = async (values: { email: string }) => {
  const { email } = values;
  if (!email) {
    return {
      status: 400,
      message: "Email must be provided."
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
    where: { email },
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
