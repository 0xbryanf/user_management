import React, { useState, useRef } from "react";
import Input from "@/components/atoms/input";
import Label from "@/components/atoms/label";

const OtpField = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="otp-0">One-Time Pin (OTP)</Label>
          <p className="text-xs text-gray-500 mt-1">
            Please check your email for the verification code.
          </p>
        </div>
      </div>

      <div className="mt-4 w-full flex space-x-2 justify-evenly">
        {otp.map((digit, index) => (
          <Input
            key={index}
            id={`otp-${index}`}
            name={`otp-${index}`}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-18 text-center text-2xl border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
          />
        ))}{" "}
      </div>
      {/* Hidden input for full OTP value */}
      <input type="hidden" name="otp" value={otp.join("")} />
    </div>
  );
};

export default OtpField;
