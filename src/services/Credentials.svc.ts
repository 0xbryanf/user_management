import { getCredentialByEmail } from "functions/getCredentialByEmail.fn";
import { getCredentialByUserId } from "functions/getCredentialByUserId.fn";
import { registerInitCredentials } from "functions/registerInitCredentials.fn";
import { requestEmailConfirmation } from "functions/requestEmailConfirmation.fn";
import { CredentialResponse } from "types/credentialInterfaces";
import {
  RegisterInit,
  RegisterInitCredentialsResponse
} from "types/registerInitCredentialInterfaces";
import { ReturnResponse } from "types/returnResponse";
import sgMail from "@sendgrid/mail";
import { sendOTPEmail } from "functions/sendOneTimePinToEmail.fn";
import { verifyOTPEmail } from "functions/verifyOTPEmail.fn";
import { verifyCredentials } from "functions/verifyCredentials.fn";

class CredentialsService {
  /**
   * Registers initial credentials for a user
   * @param {RegisterInit} credentials - The user's email and password for registration
   * @returns {Promise<ReturnResponse<RegisterInitCredentialsResponse>>} A promise resolving to the registration result
   */
  static async registerInit({
    email,
    password
  }: RegisterInit): Promise<ReturnResponse<RegisterInitCredentialsResponse>> {
    const result = await registerInitCredentials({ email, password });
    return result;
  }

  static async getCredentialByEmail(
    email: string
  ): Promise<ReturnResponse<CredentialResponse>> {
    const result = await getCredentialByEmail({ email });
    return result;
  }

  static async getCredentialByUserId(
    userId: string
  ): Promise<ReturnResponse<CredentialResponse>> {
    const result = await getCredentialByUserId({ userId });
    return result;
  }

  static async requestEmailConfirmation(
    userId: string
  ): Promise<ReturnResponse<[sgMail.ClientResponse, {}]>> {
    const user = await getCredentialByUserId({ userId });
    if (!user.data) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "User data not found."
      };
    }
    const email = (user.data as unknown as { email: string }).email;
    const result = await requestEmailConfirmation({ email });
    return result;
  }

  static async sendOTPEmail(
    userId: string
  ): Promise<ReturnResponse<[sgMail.ClientResponse, {}]>> {
    const user = await getCredentialByUserId({ userId });
    const email = (user.data as unknown as { email: string }).email;
    const result = await sendOTPEmail({ email });
    return result;
  }

  static async verifyOTPEmail(
    userId: string,
    otp: number
  ): Promise<ReturnResponse> {
    const user = await getCredentialByUserId({ userId });
    if (!user.data) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "User data not found."
      };
    }
    const email = (user.data as unknown as { email: string }).email;
    const result = await verifyOTPEmail({ email, otp });
    return result;
  }

  static async verifyCredentials(
    email: string,
    password: string
  ): Promise<ReturnResponse<string>> {
    const result = await verifyCredentials({ email, password });
    return result;
  }
}

export { CredentialsService };
