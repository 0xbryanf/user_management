import { hashValue } from "lib/helpers/hashValue";
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
    const storedValueStr = await redisClient.get(redisKey);
    const storedValue = storedValueStr
      ? (JSON.parse(storedValueStr) as { otp: string; retries: number })
      : null;
    if (!storedValue) {
      return {
        status: 400,
        message: "Invalid OTP."
      };
    }

    const hashedOtp = hashValue(`otp_value:${values.otp}`);
    const ttl = await redisClient.ttl(redisKey);

    if (storedValue.otp !== hashedOtp) {
      if (storedValue.retries >= 3) {
        await redisClient.del(redisKey);
        return {
          status: 400,
          message: "OTP verification failed too many times."
        };
      }

      const otpData = {
        otp: storedValue.otp,
        retries: storedValue.retries + 1
      };

      await redisClient.set(redisKey, JSON.stringify(otpData), "EX", ttl);
      return {
        status: 400,
        message: "Invalid OTP."
      };
    }

    await redisClient.del(redisKey);

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
  }
};
