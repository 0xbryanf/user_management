import { verifyOTPEmail } from "functions/verifyOTPEmail";

export default async function verifyUserService(email: string, otp: number) {
  if (!email || !otp) {
    return {
      status: 400,
      message: "All required fields must be provided to verify OTP."
    };
  }

  try {
    const result = await verifyOTPEmail({ to: email, otp });
    return result;
  } catch (error: unknown) {
    return {
      status: 500,
      message: "Error verifying OTP",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
