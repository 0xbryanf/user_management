"use client";

import { FormEvent, useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { signIn } from "next-auth/react";
import Button from "@/components/atoms/button";
import { FcGoogle } from "react-icons/fc";
import SignUpForm from "@/components/organisms/signUpForm";
import { calculatePasswordStrength } from "@/lib/calculatePasswordStrength";
import { validatePasswordLive } from "@/lib/validatePassword";
import { PasswordValidationResult } from "@/lib/type/passwordValidation";
import api from "@/lib/api";
import GetCredentialsTemplate from "@/components/templates/getCredentials";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showCredentialsTemplate, setShowCredentialsTemplate] = useState(false);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidationResult>({
      minLength: false,
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false
    });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const callbackUrl = urlParams.get("callbackUrl");
    const error = urlParams.get("error");

    if (error) {
      let message = "Something went wrong. Please try again.";

      if (error === "Callback") {
        message = "Login failed. Please verify your account.";
      } else if (error === "OAuthAccountNotLinked") {
        message = "Email already exists. Please sign in using the same method.";
      }

      toast.error(message, {
        duration: 2000,
        style: { fontSize: "16px" }
      });
    }

    if (callbackUrl) {
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const handleCredentialsSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match. Please double-check and try again.", {
        duration: 2000,
        style: { fontSize: "16px" }
      });
      return;
    }
    setLoading(true);

    try {
      const apiRegistrationResponse = await api.post(
        "/api/auth/register-init",
        {
          email,
          password
        }
      );
      if (apiRegistrationResponse.status === 201) {
        const otpResponse = await api.post("/api/send-otp-email");
        if (otpResponse.status === 200) {
          router.push("/verify-otp");
        } else {
          // Handle error from OTP API
          toast.error(
            `Error ${otpResponse.data?.status}: ${otpResponse.data?.message}`,
            { duration: 1000, style: { fontSize: "14px" } }
          );
          setLoading(false);
        }
      }
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      if (err.response?.status === 409) {
        setShowCredentialsTemplate(true);
      } else {
        toast.error("An unexpected error occurred. Please try again later.", {
          duration: 2000,
          style: { fontSize: "14px" }
        });
      }
    }
  };

  const handleGoogleSignUp = () => {
    signIn("google", {
      callbackUrl: "/"
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const strength = calculatePasswordStrength(value);
    setPasswordStrength(strength);
    const validation = validatePasswordLive(value);
    setPasswordValidation(validation);
  };

  return (
    <>
      {showCredentialsTemplate ? (
        <GetCredentialsTemplate />
      ) : (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
              Create Your Account!
            </h2>
            <div className="text-center text-sm tracking-tight text-gray-600">
              It's free and take only a minute.
            </div>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            <Button
              disabled={loading}
              onClick={() => handleGoogleSignUp()}
              className={`flex w-full justify-center gap-2 px-4 py-2 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-50 transition text-base ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-opacity-30 hover:cursor-pointer"
              }`}
            >
              <FcGoogle className="text-xl" />
              <span>Sign-up with Google</span>
            </Button>

            <div className="flex items-center gap-4 my-8">
              <hr className="flex-grow border-gray-300" />
              <span className="text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <SignUpForm
              onSubmit={handleCredentialsSignUp}
              loading={loading}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              setEmail={setEmail}
              setConfirmPassword={setConfirmPassword}
              handlePasswordChange={handlePasswordChange}
              passwordStrength={passwordStrength}
              passwordValidation={passwordValidation}
            />

            <div className="mt-14 text-center">
              <Button
                disabled={loading}
                onClick={() => router.push("/sign-in")}
                className={`flex w-full rounded-full justify-center gap-2 text-sm px-4 py-2 bg-white font-normal border border-gray-300 hover:bg-gray-50 transition ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-opacity-30 hover:cursor-pointer"
                }`}
              >
                Already have an account? Sign in
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </>
  );
}
