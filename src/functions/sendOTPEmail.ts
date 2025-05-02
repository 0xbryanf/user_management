import sgMail from "@sendgrid/mail";
import { hashValue } from "lib/helpers/hashValue";
import { generateOtpEmailHtml } from "utils/emails/otpTemplate";
import { redisClient } from "utils/redisClient";

export const sendOTPEmail = async (values: { email: string }) => {
  const { email } = values;

  if (!email) {
    return {
      status: 400,
      message: "Email destination must be provided."
    };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const subject = `Your One Time OTP Code - ${otp}`;
  const html = generateOtpEmailHtml(otp);

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
        5 * 60 // 5 minutes expiration
      );
    }

    return {
      status: 200,
      message: "OTP Email sent successfully",
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
