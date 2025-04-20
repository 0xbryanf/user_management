import { hashValue } from "lib/helpers/hashValue"; // Ensure secure, cryptographic hashing here
import { redisClient } from "utils/redisClient";

export const verifyOTPEmail = async (values: { to: string; otp: number }) => {
  if (!values.to || !values.otp) {
    return {
      status: 400,
      message: "OTP and recipient email are required."
    };
  }

  try {
    const redisKey = hashValue(`otp_key:${values.to}`);
    const storedValue = await redisClient.get(redisKey);

    if (!storedValue) {
      return {
        status: 400,
        message: "Invalid OTP."
      };
    }

    const hashedOtp = hashValue(`otp_value:${values.otp}`);
    if (storedValue !== hashedOtp) {
      await redisClient.del(redisKey);
      return {
        status: 400,
        message: "Invalid OTP."
      };
    }

    return {
      status: 200,
      message: "OTP verified successfully."
    };
  } catch (error: unknown) {
    return {
      status: 500,
      message: "Error sending email",
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    await redisClient.quit();
  }
};
