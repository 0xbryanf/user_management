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
import { verifyCredentials } from "functions/verifyCredentials.fn";

/**
 * Service class for managing user credentials and email verification.
 */
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

  /**
   * Retrieves credentials by email.
   * @param email - The user's email.
   * @returns Promise resolving to the credential details.
   */
  static async getCredentialByEmail(
    email: string
  ): Promise<ReturnResponse<CredentialResponse>> {
    const result = await getCredentialByEmail({ email });
    return result;
  }

  /**
   * Retrieves credentials by user ID.
   * @param userId - The user's unique ID.
   * @returns Promise resolving to the credential details.
   */
  static async getCredentialByUserId(
    userId: string
  ): Promise<ReturnResponse<CredentialResponse>> {
    const result = await getCredentialByUserId({ userId });
    return result;
  }

  /**
   * Requests an email confirmation for the specified user.
   * @param userId - The user's unique ID.
   * @returns Promise resolving to the email confirmation result.
   */
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

  /**
   * Verifies user credentials by email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns Promise resolving to the verification result (JWT token or similar).
   */
  static async verifyCredentials(
    email: string,
    password: string
  ): Promise<ReturnResponse<string>> {
    const result = await verifyCredentials({ email, password });
    return result;
  }
}

export { CredentialsService };
