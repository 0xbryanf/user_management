import { updatePassword } from "functions/updatePassword.fn";
import { Password } from "types/password";
import { ReturnResponse } from "types/returnResponse";
/**
 * Service class for managing password history operations.
 */
class PasswordHistoryService {
  /**
   * Updates the user's password and records it in password history.
   * @param password - The new password.
   * @param created_by - The user performing the update.
   * @returns Promise resolving to the result of the update operation.
   */
  static async updatePassword({
    password,
    created_by
  }: Password): Promise<ReturnResponse> {
    const result = await updatePassword({ password, created_by });
    return result;
  }
}

export { PasswordHistoryService };
