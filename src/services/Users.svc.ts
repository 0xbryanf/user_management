import { activateUser } from "functions/activateUser.fn";
import { createAuthorization } from "functions/createAuthorization.fn";
import { Authorization } from "types/authorization";

class UsersService {
  static async activateUserService(user_id: string) {
    const result = await activateUser({ user_id });
    return result;
  }

  static async createAuthorizationService(authData: Authorization) {
    const result = await createAuthorization({ authData });
    return result;
  }
}

export { UsersService };
