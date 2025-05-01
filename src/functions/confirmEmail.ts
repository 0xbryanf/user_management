import sgMail from "@sendgrid/mail";
import { generateSignupAttemptEmail } from "utils/emails/signUpAttempt";
import { getUserByEmail } from "./getUserByEmail";
import { generateToken } from "utils/generateToken";
import { hashValue } from "lib/helpers/hashValue";
import { redisClient } from "utils/redisClient";

/**
 * Confirms and sends an email verification to a user
 * @param values - Object containing the user's email
 * @returns An object with status, message, and optional data or error
 * - Generates a verification token and OTP
 * - Sends an email with a verification link
 * - Handles various error scenarios like missing email or user not found
 */
export const confirmEmail = async (values: { email: string }) => {
  const { email } = values;
  if (!email) {
    return {
      status: 400,
      message: "Email destination must be provided."
    };
  }
  const { data } = await getUserByEmail({ email });
  const userId = data && "user_id" in data ? data.user_id : undefined;
  if (!userId) {
    return {
      status: 401,
      message: "No user found"
    };
  }
  const token = generateToken(userId.toString());
  console.log("token", token);
  const link = `http://localhost:3000/confirm-identity/${Buffer.from(token).toString("base64")}`;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const subject = "Confirm Your Email Address";
  const html = generateSignupAttemptEmail(link, otp);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  const message: sgMail.MailDataRequired = {
    to: email,
    from: process.env.SENDGRID_OTP_EMAIL!,
    subject,
    html
  };
  try {
    const response = await sgMail.send(message);
    if (response[0].statusCode === 202) {
      const redisKey = hashValue(`otp_key:${email}`);

      const otpData = {
        otp: hashValue(`otp_value:${otp}`),
        retries: 0
      };

      await redisClient.set(
        redisKey,
        JSON.stringify(otpData),
        "EX",
        60 * 60 // 5 minutes expiration
      );
    }
    return {
      status: 200,
      message: "Email confirmation sent successfully",
      data: response
    };
  } catch (error: unknown) {
    return {
      status: 500,
      message: "Error sending email",
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
