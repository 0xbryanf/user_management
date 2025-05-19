"use client";

import { FormEvent, useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import Button from "@/components/atoms/button";
import { FcGoogle } from "react-icons/fc";
import SignInForm from "@/components/organisms/signInForm";
import VerifyOTPTemplate from "@/components/templates/verifyOTPTemplate";
import api from "@/lib/api";

/**
 * SignInPage component handles user authentication with multiple sign-in methods.
 *
 * Supports:
 * - Credentials-based sign-in with email and password
 * - Google OAuth sign-in
 * - Two-factor authentication via OTP
 */
export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerifyOTPTemplate, setShowVerifyOTPTemplate] = useState(false);

  const handleCredentialsSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/auth/sign-in", {
        email,
        password
      });
      if (response.status === 404) {
        toast.error(`404 Not Found: Credential not found.`, {
          duration: 2500,
          style: { fontSize: "14px" },
          icon: null
        });
        return;
      }

      const otpResponse = await api.post("/api/send-otp-email");
      if (!otpResponse || otpResponse.status != 200) {
        const message = `${otpResponse.status} ${otpResponse.data.message}`;
        toast.error(message, {
          duration: 2500,
          style: { fontSize: "14px" },
          icon: null
        });
        return;
      }
      setShowVerifyOTPTemplate(true);
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      const message = `${err.response?.data?.error}`;
      toast.error(message, {
        duration: 2500,
        style: { fontSize: "16px" },
        icon: null
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiates Google OAuth sign-in process with a redirect to the home page after successful authentication.
   * Uses NextAuth's signIn method with the "google" provider.
   */
  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: "/"
    });
  };

  return (
    <>
      {showVerifyOTPTemplate ? (
        <VerifyOTPTemplate init={true} />
      ) : (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            <Button
              disabled={loading}
              onClick={() => handleGoogleLogin()}
              className={`flex w-full justify-center gap-2 px-4 py-2 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-50 transition text-base ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-opacity-30 hover:shadow-sm hover:cursor-pointer"
              }`}
            >
              <FcGoogle className="text-xl" />
              <span>Continue with Google</span>
            </Button>

            <div className="flex items-center gap-4 my-10">
              <hr className="flex-grow border-gray-300" />
              <span className="text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <SignInForm
              onSubmit={handleCredentialsSignIn}
              loading={loading}
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
            />

            <div className="mt-14 text-center">
              <Button
                disabled={loading}
                onClick={() => router.push("/sign-up")}
                className={`flex w-full rounded-full justify-center gap-2 text-sm px-4 py-2 bg-white font-normal border border-gray-300 hover:bg-gray-50 transition ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-opacity-30 hover:cursor-pointer"
                }`}
              >
                Create new account{" "}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
