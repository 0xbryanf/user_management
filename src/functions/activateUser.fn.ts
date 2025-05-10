import { ReturnResponse } from "types/returnResponse";
import { User, UserResponse } from "types/userInterfaces";
import { loadSchemaModel } from "schema/loadSchemaModel.utl";

export const activateUser = async (
  values: User
): Promise<ReturnResponse<UserResponse>> => {
  if (!values.user_id) {
    return {
      status: 400,
      statusText: "Bad Request",
      message: "User ID is required."
    };
  }

  const UsersModel = await loadSchemaModel("User_Management", "Users");
  if (!UsersModel) {
    return {
      status: 503,
      statusText: "Service Unavailable",
      message: "Failed to load Users model."
    };
  }

  try {
    const [updatedCount, updatedRows] = await UsersModel.update(
      {
        is_active: true,
        updated_by: values.user_id,
        updated_at: new Date()
      },
      {
        where: { user_id: values.user_id },
        returning: true
      }
    );

    const updatedUser = updatedRows?.[0];

    if (!updatedUser || updatedCount === 0) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "User not found."
      };
    }

    return {
      status: 200,
      statusText: "OK",
      message: "User activated successfully.",
      data: updatedUser.get({ plain: true }) as UserResponse
    };
  } catch (error: unknown) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        (error as Error).message ||
        "An unexpected error occurred while activating the user."
    };
  }
};
