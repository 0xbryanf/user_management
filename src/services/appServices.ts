import { CreateUser } from "types/createUser";
import createUserService from "./createUserService";
import checkConnectionService from "./checkConnectionService";

class AppServices {
  public async checkConnectionService() {
    return await checkConnectionService();
  }

  public async createUserService(values: CreateUser) {
    return await createUserService(values);
  }
}

export default AppServices;
