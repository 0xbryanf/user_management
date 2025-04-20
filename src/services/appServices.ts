import { CreateUser } from "types/createUser";
import createUserService from "./createUserService";
import verifyUserService from "./verifyUserService";
import sendOTPEmailService from "./sendOtpEmailService";
import verifyOTPEmailService from "./verifyOTPEmailService";

class AppServices {
  public async createUserService(values: CreateUser) {
    return await createUserService(values);
  }

  public async verifyUserService(email: string, password: string) {
    return await verifyUserService(email, password);
  }

  public async sendOTPEmailService(to: string) {
    return await sendOTPEmailService(to);
  }

  public async verifyOTPEmailService(email: string, to: number) {
    return await verifyOTPEmailService(email, to);
  }
}

export default AppServices;
