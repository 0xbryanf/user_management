import verifyUserService from "./verifyUserService";
import sendOTPEmailService from "./sendOtpEmailService";
import verifyOTPEmailService from "./verifyOTPEmailService";
import registerInitCredentialService from "./registerInitCredentialService";
import { RegisterInitCredentials } from "types/registerInitCredentialInterfaces";

class AppServices {
  public async registerInitCredentialService(values: RegisterInitCredentials) {
    return await registerInitCredentialService(values);
  }

  public async verifyUserService(email: string, password: string) {
    return await verifyUserService(email, password);
  }

  public async sendOTPEmailService(email: string) {
    return await sendOTPEmailService(email);
  }

  public async verifyOTPEmailService(email: string, to: number) {
    return await verifyOTPEmailService(email, to);
  }
}

export default AppServices;
