import sgMail from "@sendgrid/mail";
import { hashValue } from "lib/helpers/hashValue";
import { generateOtpEmailHtml } from "utils/otpTemplate";
import { redisClient } from "utils/redisClient";

export const sendOTPEmail = async (values: { to: string }) => {
  const { to } = values;

  if (!to) {
    return {
      status: 400,
      message:
        "All required fields (to, subject, html) must be provided to send an email."
    };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const subject = `Your One Time OTP Code - ${otp}`;
  const html = generateOtpEmailHtml(otp);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const message: sgMail.MailDataRequired = {
    to,
    from: process.env.SENDGRID_OTP_EMAIL!,
    subject,
    html
  };

  try {
    const response = await sgMail.send(message);

    if (response[0].statusCode === 202) {
      const redisKey = hashValue(`otp_key:${to}`);
      await redisClient.set(
        redisKey,
        hashValue(`otp_value:${otp}`),
        "EX",
        15 * 60 // 15 minutes expiration
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
