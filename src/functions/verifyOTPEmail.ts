import { hashValue } from "lib/helpers/hashValue";
import { RedisHelper } from "lib/helpers/Redis";
import { ReturnResponse } from "types/returnResponse";

/**
 * Verifies an OTP (One-Time Password) for a given email address.
 *
 * @param values - Object containing email and OTP to verify.
 * @returns A response indicating whether the OTP was verified or failed.
 */
export const verifyOTPEmail = async (values: {
  email: string;
  otp: number;
}): Promise<ReturnResponse> => {
  try {
    const { email, otp } = values;

    if (!email || !otp) {
      return {
        status: 400,
        message: "OTP and recipient email are required."
      };
    }

    const redisKey = hashValue(`otp_key:${email}`);
    const storedValueStr = await RedisHelper.get(redisKey);

    if (!storedValueStr) {
      return {
        status: 400,
        message: "Invalid or expired OTP."
      };
    }

    const storedValue: { otp: string; retries: number } =
      JSON.parse(storedValueStr);
    const ttl = await RedisHelper.ttl(redisKey);

    if (ttl < 0) {
      return {
        status: 400,
        message: "OTP expired or not found."
      };
    }

    const hashedInputOtp = hashValue(`otp_value:${otp}`);

    if (storedValue.otp !== hashedInputOtp) {
      const updatedRetries = storedValue.retries + 1;

      if (updatedRetries >= 3) {
        await RedisHelper.del(redisKey);
        return {
          status: 400,
          message: "OTP verification failed too many times."
        };
      }

      await RedisHelper.set({
        key: redisKey,
        data: {
          otp: storedValue.otp,
          retries: updatedRetries
        },
        expiration: ttl
      });

      return {
        status: 400,
        message: "Invalid OTP."
      };
    }

    await RedisHelper.del(redisKey);

    return {
      status: 200,
      message: "OTP verified successfully."
    };
  } catch (error) {
    return {
      status: 500,
      message:
        (error as Error).message ||
        "An unexpected error occurred during OTP verification."
    };
  }
};
