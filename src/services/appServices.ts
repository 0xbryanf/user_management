import { CreateUser } from "types/createUser";
import createUserService from "./createUserService";
import verifyUserService from "./verifyUserService";
import sendOTPEmailService from "./sendOtpEmailService";

class AppServices {
  public async createUserService(values: CreateUser) {
    return await createUserService(values);
  }

  public async verifyUserService(email: string, password: string) {
    return await verifyUserService(email, password);
  }

  public async sendOTPEmailService(
    to: string,
    from: string,
    subject: string,
    html: string
  ) {
    const values = {
      to,
      from,
      subject,
      html
    };
    return await sendOTPEmailService(values);
  }
}

export default AppServices;
