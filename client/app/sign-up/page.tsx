"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { FcGoogle } from "react-icons/fc";
import Button from "@/components/atoms/button";
import Spinner from "@/lib/spinner";
import SignUpForm from "@/components/organisms/signUpForm";
import VerifyOTPTemplate from "@/components/templates/verifyOTPTemplate";
import { useAuthMethod } from "@/app/contexts/AuthMethodContext";
import { calculatePasswordStrength } from "@/lib/calculatePasswordStrength";
import { validatePasswordLive } from "@/lib/validatePassword";
import { PasswordValidationResult } from "@/lib/type/passwordValidation";
import api from "@/lib/api";
import GetCredentialsTemplate from "../../components/templates/getCredentialsTemplate";
import { useOAuthCode } from "../contexts/OAuthCodeContext";

type ViewState = "FIND_ACCOUNT" | "REGISTER_INIT" | "VERIFY_OTP";

export default function SignUpPage() {
  const router = useRouter();
  const { setIsOauthLogin } = useAuthMethod();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("REGISTER_INIT");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { setIsConflict } = useOAuthCode();
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidationResult>({
      minLength: false,
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false
    });

  const handleCredentialsSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOauthLogin(false);
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords don't match.", {
        duration: 2000,
        style: { fontSize: "16px" },
        icon: null
      });
      setLoading(false);
      return;
    }

    try {
      setIsOauthLogin(true);
      const initRes = await api.post("/api/auth/register-init-credentials", {
        email,
        password
      });

      if (initRes.status === 201) {
        const otpEmailRes = await api.post("/api/send-otp-email");
        if (otpEmailRes.status === 200) {
          setViewState("VERIFY_OTP");
        } else {
          toast.error(`${otpEmailRes.data?.message}`, {
            duration: 2500,
            style: { fontSize: "14px" },
            icon: null
          });
        }
      } else {
        setViewState("REGISTER_INIT");
      }
    } catch (error: unknown) {
      const err = error as AxiosError;
      const statusCode = err.response?.status;

      if (statusCode === 409) {
        setIsConflict(true);
        setViewState("FIND_ACCOUNT");
      } else {
        toast.error(
          `${statusCode ?? ""} ${err.response?.statusText ?? err.message}`,
          {
            duration: 2500,
            style: { fontSize: "14px" },
            icon: null
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
    setPasswordValidation(validatePasswordLive(value));
  };

  return (
    <div className="relative min-h-screen bg-white">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75">
          <Spinner />
        </div>
      )}

      {viewState === "FIND_ACCOUNT" && <GetCredentialsTemplate />}
      {viewState === "VERIFY_OTP" && <VerifyOTPTemplate />}
      {viewState === "REGISTER_INIT" && (
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
            <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
              Create Your Account!
            </h2>
            <p className="text-center text-sm text-gray-600">
              It's free and takes only a minute.
            </p>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
            <Button
              disabled={loading}
              onClick={() => (window.location.href = "/api/auth/googleOauth2")}
              className="flex w-full justify-center gap-2 px-4 py-2 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-50 transition text-base hover:cursor-pointer"
            >
              <FcGoogle className="text-xl" />
              <span>Sign-up with Google</span>
            </Button>

            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <hr className="flex-grow border-gray-300" />
              <span>or</span>
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

            <Button
              disabled={loading}
              onClick={() => router.push("/sign-in")}
              className="flex w-full justify-center gap-2 text-sm px-4 py-2 bg-white font-normal border border-gray-300 hover:bg-gray-50 transition"
            >
              Already have an account? Sign in
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
