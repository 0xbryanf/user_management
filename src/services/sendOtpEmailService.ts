import { sendOTPEmail } from "functions/sendOTPEmail";
import { SendEmailInput } from "types/sendEmailInput";

export default async function sendOTPEmailService(values: SendEmailInput) {
  if (!values) {
    return {
      status: 400,
      message: "Missing required information to send OTP email."
    };
  }

  try {
    const result = await sendOTPEmail(values);
    return result;
  } catch (error: unknown) {
    return {
      status: 500,
      message: "Error creating user",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
