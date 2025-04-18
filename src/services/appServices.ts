import { CreateUser } from "types/createUser";
import createUserService from "./createUserService";
import verifyUserService from "./verifyUserService";

class AppServices {
  public async createUserService(values: CreateUser) {
    return await createUserService(values);
  }

  public async verifyUserService(email: string, password: string) {
    return await verifyUserService(email, password);
  }
}

export default AppServices;
