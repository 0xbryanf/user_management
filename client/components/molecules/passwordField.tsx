import React, { useState } from "react";
import Input from "@/components/atoms/input";
import Label from "@/components/atoms/label";
import IconToggle from "@/components/atoms/iconToggle";

const PasswordField = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const toggleVisibility = () => setShowPassword(!showPassword);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor="password">Password</Label>
        <a
          href="#"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Forgot password?
        </a>
      </div>
      <div className="mt-2 relative">
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
          autoComplete="current-password"
          required
        />
        {passwordValue && (
          <IconToggle isVisible={showPassword} onClick={toggleVisibility} />
        )}
      </div>
    </div>
  );
};

export default PasswordField;
