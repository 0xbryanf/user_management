import { activateAuthorization } from "functions/activateAuthorization.fn";
import { activateUser } from "functions/activateUser.fn";
import { createAuthorization } from "functions/createAuthorization.fn";
import { getAuthorization } from "functions/getAuthorization.fn";
import { verifyUserActivation } from "functions/verifyUserActivation.fn";
import { Authorization } from "types/authorization";

class UsersService {
  static async activateUserService(user_id: string) {
    const result = await activateUser({ user_id });
    return result;
  }

  static async createAuthorizationService(
    session: string,
    token: string,
    user_id: string,
    isAuthorize = false,
    expiration: number
  ) {
    const authData: Authorization = {
      key: session,
      userId: user_id,
      authorizationToken: token,
      isAuthorize,
      expiration
    };
    const result = await createAuthorization({ authData });
    return result;
  }

  static async getAuthorizationService(key: string) {
    const result = await getAuthorization({ key });
    return result;
  }

  static async activateAuthorization(key: string) {
    const result = await activateAuthorization({ key });
    return result;
  }

  static async verifyUserActivation(user_id: string) {
    const result = await verifyUserActivation({ user_id });
    return result;
  }
}

export { UsersService };
