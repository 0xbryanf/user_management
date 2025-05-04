import { hashValue } from "lib/helpers/hashValue";
import { sendEmail } from "lib/helpers/sendEmail";
import { RedisHelper } from "lib/helpers/Redis";
import { ReturnResponse } from "types/returnResponse";
import { generateOtpEmailHtml } from "utils/emails/otpTemplate";
import sgMail from "@sendgrid/mail";

/**
 * Sends a One-Time Password (OTP) to the user's email and stores the OTP in Redis.
 *
 * @param values - Object containing the user's email.
 * @returns A standardized response object with the status, message, and optional SendGrid response data.
 *
 * @remarks
 * - OTP is 6-digit numeric.
 * - The hashed OTP and retry counter are stored in Redis with a 20-minute expiration.
 */
export const sendOTPEmail = async (values: {
  email: string;
}): Promise<ReturnResponse<[sgMail.ClientResponse, {}]>> => {
  try {
    const { email } = values;

    if (!email) {
      return {
        status: 400,
        message: "Email destination must be provided."
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const emailResponse = await sendEmail({
      to: email,
      from: process.env.SENDGRID_OTP_EMAIL!,
      subject: `Your One Time OTP Code - ${otp}`,
      html: generateOtpEmailHtml(otp)
    });

    const [res] = emailResponse;

    if (res.statusCode !== 202) {
      return {
        status: res.statusCode,
        message: "Failed to send OTP email.",
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
      message: "OTP Email sent successfully.",
      data: emailResponse
    };
  } catch (error) {
    return {
      status: 500,
      message:
        (error as Error).message ||
        "An unexpected error occurred while sending OTP."
    };
  }
};
