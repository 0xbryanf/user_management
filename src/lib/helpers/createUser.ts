import { User, UserResponse } from "types/userInterfaces";
import { loadSchemaModel } from "utils/loadSchemaModel";

/**
 * Creates a new user in the database.
 *
 * @param user - Object containing user_id and optionally created_by.
 * @returns A plain object representing the created user.
 * @throws If the model loading or user creation fails.
 */
export const createUser = async ({
  user_id,
  created_by
}: User): Promise<UserResponse> => {
  if (!user_id) {
    throw new Error("user_id is required.");
  }

  const UsersModel = await loadSchemaModel("User_Management", "Users");
  if (!UsersModel) {
    throw new Error("Failed to load Users model.");
  }

  const user = await UsersModel.create({
    user_id,
    is_active: false,
    created_by: created_by ?? user_id
  });

  return user.get({ plain: true }) as UserResponse;
};
