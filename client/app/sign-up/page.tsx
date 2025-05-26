"use client";

import { FormEvent, useState, useEffect, useContext, useRef } from "react";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
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
import VerifyOTPTemplate from "@/components/templates/verifyOTPTemplate";

type ViewState = "FIND_ACCOUNT" | "REGISTER_INIT" | "VERIFY_OTP";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [viewState, setViewState] = useState<ViewState>("REGISTER_INIT");
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidationResult>({
      minLength: false,
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false
    });

  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const ranOnce = useRef(false);

  useEffect(() => {
    // only run once when a code appears
    if (!code || ranOnce.current) return;
    ranOnce.current = true;

    // as soon as code is detected, show spinner
    setLoading(true);

    const handleAuthFlow = async () => {
      try {
        // 1) Exchange code
        const { data: oauthPayload } = await api.post(
          "/api/auth/googleOauth2",
          { code },
          { headers: { "Content-Type": "application/json" } }
        );
        const { email, provider, provider_user_id, email_verified } =
          oauthPayload.user ?? {};

        // 2) Validate
        if (
          !email ||
          !provider ||
          !provider_user_id ||
          email_verified == null
        ) {
          throw new Error("Missing fields in OAuth response");
        }

        // 3) Register
        const regRes = await api.post(
          "/api/auth/register-init-oauth",
          { email, provider, provider_user_id, email_verified },
          { headers: { "Content-Type": "application/json" } }
        );
        if (regRes.status !== 201) {
          // registration was not needed or failed → go back to form
          setViewState("REGISTER_INIT");
          setLoading(false);
          return;
        }

        // 4) Activate & redirect
        const activation = await api.post("/api/activate-oauth");
        if (activation.status === 200) {
          // keep loading spinner until we navigate away
          router.replace("/");
          return;
        }

        // any other status is an error
        throw new Error(`Activation failed: ${activation.status}`);
      } catch (unknownError: unknown) {
        const err = unknownError as AxiosError;
        const statusCode = err.response?.status;

        if (statusCode === 409) {
          setViewState("FIND_ACCOUNT");
        } else {
          toast.error(
            `${statusCode ?? ""} ${err.response?.statusText ?? err.message}`,
            { duration: 2500, style: { fontSize: "14px" }, icon: null }
          );
        }

        // stop spinner on error
        setLoading(false);
      }
    };

    handleAuthFlow();
  }, [code]);

  const handleCredentialsSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    if (password !== confirmPassword) {
      toast.error(
        "Bad Request: Passwords don't match. Please double-check and try again.",
        {
          duration: 2000,
          style: { fontSize: "16px" },
          icon: null
        }
      );
      return;
    }

    try {
      const registrationInitresponse = await api.post(
        "/api/auth/register-init-credentials",
        {
          email,
          password
        }
      );

      if (registrationInitresponse && registrationInitresponse.status === 201) {
        const otpEmailResponse = await api.post("/api/send-otp-email");
        if (otpEmailResponse.status === 200) {
          setViewState("VERIFY_OTP");
        } else {
          toast.error(`${otpEmailResponse?.data?.message}`, {
            duration: 2500,
            style: { fontSize: "14px" },
            icon: null
          });
        }
      } else {
        setViewState("REGISTER_INIT");
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string }>;
      if (err.status === 409) {
        setViewState("FIND_ACCOUNT");
      } else {
        toast.error(`${err.response?.status} ${err.response?.statusText}`, {
          duration: 2500,
          style: { fontSize: "14px" },
          icon: null
        });
      }
    } finally {
      setLoading(false);
    }
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
      {viewState === "FIND_ACCOUNT" && <GetCredentialsTemplate />}
      {viewState === "VERIFY_OTP" && <VerifyOTPTemplate init={true} />}
      {viewState === "REGISTER_INIT" && (
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
              onClick={() => {
                window.location.href = "/api/auth/googleOauth2";
              }}
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
    </>
  );
}
