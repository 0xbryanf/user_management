import { activateUser } from "functions/activateUser";

class UsersService {
  static async activateUser(user_id: string) {
    const result = await activateUser({ user_id });
    return result;
  }
}

export { UsersService };
