import React from "react";
import PasswordField from "@/components/molecules/passwordField";
import Button from "@/components/atoms/button";
import ConfirmPasswordField from "../molecules/confirmPasswordField";
import { PasswordValidationResult } from "@/lib/type/passwordValidation";
import PasswordRequirements from "../molecules/passwordRequirements";
import PasswordStrengthBar from "../molecules/passwordStrengthBar";

type ChangePasswordProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  password: string;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  passwordStrength: number;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  passwordValidation: PasswordValidationResult;
};

const ChangePasswordForm = ({
  onSubmit,
  loading,
  password,
  confirmPassword,
  setConfirmPassword,
  passwordStrength,
  handlePasswordChange,
  passwordValidation
}: ChangePasswordProps) => (
  <form className="space-y-3" onSubmit={onSubmit}>
    <PasswordField value={password} onChange={handlePasswordChange} />
    <PasswordRequirements password={password} validation={passwordValidation} />
    <PasswordStrengthBar
      password={password}
      passwordStrength={passwordStrength}
    />
    <ConfirmPasswordField
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
    <Button
      disabled={loading}
      className={`flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-opacity-60 backdrop-blur-md px-3 py-2 text-base font-medium text-white shadow-md transition duration-200 ease-in-out focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
        loading
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-opacity-80 hover:shadow-lg hover:cursor-pointer"
      }`}
      type="submit"
    >
      Update Password
    </Button>
  </form>
);

export default ChangePasswordForm;
