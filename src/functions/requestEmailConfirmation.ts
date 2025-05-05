import { emailConfirmationTemplate } from "utils/emails/emailConfirmationTemplate";
import { generateToken } from "utils/generateToken";
import { hashValue } from "lib/helpers/hashValue";
import { findOneCredential } from "lib/helpers/findOneCredential";
import { sendEmail } from "lib/helpers/sendEmail";
import { RedisHelper } from "lib/helpers/Redis";
import { ReturnResponse } from "types/returnResponse";
import sgMail from "@sendgrid/mail";

/**
 * Sends a confirmation email with a verification link and one-time password (OTP).
 *
 * @param values - Object containing the user's email address.
 * @returns A standardized response object indicating success or failure.
 */
export const requestEmailConfirmation = async (values: {
  email: string;
}): Promise<ReturnResponse<[sgMail.ClientResponse, {}]>> => {
  try {
    const { email } = values;

    if (!email) {
      return {
        status: 400,
        statusText: "Bad Request",
        message: "Email destination must be provided."
      };
    }

    const user = await findOneCredential({ email });
    if (!user) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "User not found."
      };
    }

    const token = generateToken(user.user_id);
    const encodedToken = Buffer.from(token).toString("base64url");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const emailResponse = await sendEmail({
      to: email,
      from: process.env.SENDGRID_OTP_EMAIL!,
      subject: `Confirm Your Email Address - ${otp}`,
      html: emailConfirmationTemplate(
        `${process.env.CLIENT_URL}/confirm-identity/${encodedToken}`,
        otp
      )
    });

    const [res] = emailResponse;
    if (res.statusCode !== 202) {
      return {
        status: 502,
        statusText: "Bad Gateway",
        message: "Email confirmation failed.",
        data: emailResponse
      };
    }

    await RedisHelper.set({
      key: hashValue(`otp_key:${email}`),
      data: { otp: hashValue(`otp_value:${otp}`), retries: 0 },
      expiration: 60 * 20 // 20 minutes
    });

    return {
      status: 200,
      statusText: "OK",
      message: "Email confirmation sent successfully.",
      data: emailResponse
    };
  } catch (error) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        (error as Error).message ||
        "An unexpected error occurred while sending the email."
    };
  }
};
