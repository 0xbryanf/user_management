import { loadSchemaModel } from "schema/loadSchemaModel.utl";
/**
 * Helper class for user-related utilities.
 */
class UserHelper {
  /**
   * Checks if the user with the given ID is active.
   * @param user_id - The user's unique identifier.
   * @returns Promise resolving to true if active, false otherwise.
   * @throws If user_id is missing or UsersModel cannot be loaded.
   */
  static async VerifyIsActive(user_id: string): Promise<boolean> {
    if (!user_id) {
      throw new Error(`Missing information to verify user is active.`);
    }

    const UsersModel = await loadSchemaModel("User_Management", "Users");
    if (!UsersModel) {
      throw new Error("Failed to load Users Model");
    }
    const user = (await UsersModel.findOne({
      where: { user_id },
      attributes: ["is_active"],
      raw: true
    })) as { is_active: boolean } | null;

    return user?.is_active ?? false;
  }
}

export { UserHelper };
