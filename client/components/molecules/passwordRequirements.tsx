import { PasswordValidationResult } from "@/lib/type/passwordValidation";
import React from "react";

type PasswordRequirementsProps = {
  password: string;
  validation: PasswordValidationResult;
};

const PasswordRequirements = ({
  password,
  validation
}: PasswordRequirementsProps) => {
  if (!password) return null; // Don't show if password is empty

  return (
    <div className="mt-4 space-y-1 text-[10px] text-gray-600">
      <div
        className={validation.minLength ? "text-green-600" : "text-gray-400"}
      >
        {validation.minLength ? "✓" : "✗"} At least 8 characters
      </div>
      <div
        className={validation.hasLowercase ? "text-green-600" : "text-gray-400"}
      >
        {validation.hasLowercase ? "✓" : "✗"} Contains a lowercase letter
      </div>
      <div
        className={validation.hasUppercase ? "text-green-600" : "text-gray-400"}
      >
        {validation.hasUppercase ? "✓" : "✗"} Contains an uppercase letter
      </div>
      <div
        className={validation.hasNumber ? "text-green-600" : "text-gray-400"}
      >
        {validation.hasNumber ? "✓" : "✗"} Contains a number
      </div>
      <div
        className={
          validation.hasSpecialChar ? "text-green-600" : "text-gray-400"
        }
      >
        {validation.hasSpecialChar ? "✓" : "✗"} Contains a special character
      </div>
    </div>
  );
};

export default PasswordRequirements;
