import React, { useState } from "react";
import Input from "@/components/atoms/input";
import Label from "@/components/atoms/label";
import IconToggle from "@/components/atoms/iconToggle";

export type PasswordFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordField = ({ value, onChange }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);

  return (
    <div>
      <div className="mt-1 relative">
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete="current-password"
          placeholder="Password"
          required
        />
        {value && (
          <IconToggle isVisible={showPassword} onClick={toggleVisibility} />
        )}
      </div>
    </div>
  );
};

export default PasswordField;
