import { sendOTPEmail } from "functions/sendOTPEmail";

export default async function sendOTPEmailService(to: string) {
  if (!to) {
    return {
      status: 400,
      message: "Missing required information to send OTP email."
    };
  }

  try {
    const result = await sendOTPEmail({ to });
    return result;
  } catch (error: unknown) {
    return {
      status: 500,
      message: "Error creating user",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
