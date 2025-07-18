import React from "react";
import PasswordField from "@/components/molecules/passwordField";
import Button from "@/components/atoms/button";
import EmailField from "../molecules/emailField";

type SignInFormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
};

const SignInForm = ({
  onSubmit,
  loading,
  email,
  setEmail,
  password,
  setPassword
}: SignInFormProps) => (
  <>
    <form className="space-y-3" onSubmit={onSubmit}>
      <EmailField value={email} onChange={(e) => setEmail(e.target.value)} />
      <PasswordField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        disabled={loading}
        className={`flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-opacity-60 backdrop-blur-md px-3 py-2 text-base font-semibold text-white shadow-md transition duration-200 ease-in-out focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-opacity-80 hover:shadow-lg hover:cursor-pointer"
        }`}
        type="submit"
      >
        Sign in
      </Button>
    </form>
  </>
);

export default SignInForm;
