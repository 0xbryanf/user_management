import React, { useState } from "react";
import Input from "@/components/atoms/input";
import Label from "@/components/atoms/label";

const OtpField = () => {
  const [otpValue, setOtpValue] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="otp">One-Time Password (OTP)</Label>
          <p className="text-xs text-gray-500 mt-1">
            Please check your email for the verification code.
          </p>
        </div>
      </div>
      <div className="mt-2">
        <Input
          id="otp"
          name="otp"
          type="text"
          value={otpValue}
          onChange={(e) => setOtpValue(e.target.value)}
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={6}
          required
        />
      </div>
    </div>
  );
};

export default OtpField;
