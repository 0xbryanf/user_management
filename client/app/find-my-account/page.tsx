"use client";

import { FormEvent, useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
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
import FindEmailForm from "@/components/organisms/findEmailForm";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidationResult>({
      minLength: false,
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false
    });

  /**
   * Handles OAuth and authentication error handling on the sign-up page.
   * Checks URL parameters for authentication errors and displays appropriate toast notifications.
   * Clears error parameters from the URL to prevent repeated error displays.
   *
   * @remarks
   * - Detects specific OAuth errors like "Callback" and "OAuthAccountNotLinked"
   * - Provides user-friendly error messages based on error type
   * - Removes error parameters from URL to maintain clean navigation state
   */
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

  /**
   * Handles user sign-up with email and password credentials.
   *
   * @remarks
   * - Validates that password and confirm password match
   * - Sends registration request to backend API
   * - Displays success/error toast notifications
   * - Redirects to identity verification page on successful registration
   *
   * @param event - Form submission event
   * @throws {AxiosError} Handles potential registration errors with user-friendly messages
   */
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
      const registrationResponse = await api.post("/api/auth/register-init", {
        email,
        password
      });

      if (
        registrationResponse.status === 409 &&
        registrationResponse.statusText.toLowerCase() === "conflict"
      ) {
        router.push("/validate-identity");
      }

      if (registrationResponse.status === 201) {
        const otpResponse = await api.post("/api/send-otp-email");
        router.push("/verify-identity");
        if (otpResponse.status != 200) {
          toast.error(
            `Error ${otpResponse.data?.status}: ${otpResponse.data?.message}`,
            {
              duration: 1000,
              style: { fontSize: "14px" }
            }
          );
          setLoading(false);
        }
      } else {
        toast.error(
          `Error ${registrationResponse.data?.status}: ${registrationResponse.data?.message}`,
          {
            duration: 1000,
            style: { fontSize: "14px" }
          }
        );
        setLoading(false);
      }
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      const message = `Error ${err.response?.status}: ${err.response?.statusText}`;
      toast.error(message, {
        duration: 2500,
        style: { fontSize: "14px" }
      });

      setLoading(false);
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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 md:text-center sm:text-start text-4xl font-bold tracking-tight text-gray-900">
            Have you already created an account?
          </h2>
          <div className="mt-2 sm:justify-start md:text-center text-base tracking-tight text-gray-600">
            Looks like there’s already an account with this email—let’s help you
            sign in.
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <FindEmailForm
            onSubmit={handleCredentialsSignUp}
            loading={loading}
            email={email}
            setEmail={setEmail}
          />

          <div className="mt-14 text-center">
            <Button
              disabled={loading}
              onClick={() => router.push("/sign-up")}
              className={`flex w-full rounded-full tracking-tight justify-center gap-2 text-base px-4 py-2 bg-white font-normal border border-gray-300 hover:bg-gray-50 transition ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-opacity-30 hover:cursor-pointer"
              }`}
            >
              Continue setting up your new account.
            </Button>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
}
