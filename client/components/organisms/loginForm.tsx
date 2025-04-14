import React from "react";
import EmailField from "@/components/molecules/emailField";
import PasswordField from "@/components/molecules/passwordField";
import Button from "@/components/atoms/button";

const LoginForm = () => (
  <form className="space-y-6" method="POST" action="#">
    <EmailField />
    <PasswordField />
    <Button type="submit">Sign in</Button>
  </form>
);

export default LoginForm;
