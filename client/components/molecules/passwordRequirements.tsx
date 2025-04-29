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
  const requirements = [
    { met: validation.minLength, label: "At least 8 characters" },
    { met: validation.hasLowercase, label: "Contains a lowercase letter" },
    { met: validation.hasUppercase, label: "Contains an uppercase letter" },
    { met: validation.hasNumber, label: "Contains a number" },
    { met: validation.hasSpecialChar, label: "Contains a special character" }
  ];

  // Check if all requirements are met
  const allRequirementsMet = requirements.every((req) => req.met);

  if (!password.trim() || allRequirementsMet) return null; // Hide if password empty or all valid

  return (
    <div className="mt-4 space-y-1 text-[10px] text-gray-600">
      {requirements
        .filter((req) => !req.met) // Only show unmet requirements
        .map((req, index) => (
          <div key={index} className="text-gray-400">
            ✗ {req.label}
          </div>
        ))}
    </div>
  );
};

export default PasswordRequirements;
