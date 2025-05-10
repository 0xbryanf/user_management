import { updatePassword } from "functions/updatePassword.fn";
import { Password } from "types/password";
import { ReturnResponse } from "types/returnResponse";

class PasswordHistoryService {
  static async updatePassword({
    password,
    created_by
  }: Password): Promise<ReturnResponse> {
    const result = await updatePassword({ password, created_by });
    return result;
  }
}

export { PasswordHistoryService };
