import React, { useState } from "react";
import Input from "@/components/atoms/input";
import Label from "@/components/atoms/label";
import IconToggle from "@/components/atoms/iconToggle";
import { PasswordFieldProps } from "./passwordField";

const ConfirmPasswordField = ({ value, onChange }: PasswordFieldProps) => {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div>
      <div className="mt-2 relative">
        <Input
          id="password"
          name="password"
          type={showConfirmPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Confirm Password"
          autoComplete="current-password"
          required
        />
        {value && (
          <IconToggle
            isVisible={showConfirmPassword}
            onClick={toggleVisibility}
          />
        )}
      </div>
    </div>
  );
};

export default ConfirmPasswordField;
