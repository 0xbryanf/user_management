import { activateAuthorization } from "functions/activateAuthorization.fn";
import { activateUser } from "functions/activateUser.fn";
import { createAuthorization } from "functions/createAuthorization.fn";
import { getAuthorization } from "functions/getAuthorization.fn";
import { getUserAcrossEntities } from "functions/getUserAcrossEntities.fn";
import { updateAuthorization } from "functions/updateAuthorization.fn";
import { verifyUserActivation } from "functions/verifyUserActivation.fn";
import { Authorization } from "types/authorization";

/**
 * Service class for user and authorization-related operations.
 */
class UsersService {
  /**
   * Activates the specified user.
   * @param user_id - The user's unique identifier.
   */
  static async activateUserService(user_id: string) {
    const result = await activateUser({ user_id });
    return result;
  }

  /**
   * Creates a new authorization record.
   * @param session - Session key.
   * @param token - Authorization token.
   * @param user_id - User's unique identifier.
   * @param isAuthorize - Authorization status.
   * @param expiration - Expiration timestamp.
   */
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

  /**
   * Retrieves an authorization record by its key.
   * @param key - Authorization key.
   */
  static async getAuthorizationService(key: string) {
    const result = await getAuthorization({ key });
    return result;
  }

  /**
   * Activates the specified authorization.
   * @param key - Authorization key.
   */
  static async activateAuthorizationService(key: string) {
    const result = await activateAuthorization({ key });
    return result;
  }

  /**
   * Verifies whether the user has been activated.
   * @param user_id - User's unique identifier.
   */
  static async verifyUserActivationService(user_id: string) {
    const result = await verifyUserActivation({ user_id });
    return result;
  }

  /**
   * Updates an authorization record.
   * @param authData - Authorization data to update.
   */
  static async updateAuthorizationService(authData: Authorization) {
    const result = await updateAuthorization({ authData });
    return result;
  }

  static async getUserAcrossEntitiesService(email: string) {
    const result = await getUserAcrossEntities({ email });
    return result;
  }
}

export { UsersService };
