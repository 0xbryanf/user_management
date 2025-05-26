"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Button from "@/components/atoms/button";
import { FcGoogle } from "react-icons/fc";
import SignUpForm from "@/components/organisms/signUpForm";
import { calculatePasswordStrength } from "@/lib/calculatePasswordStrength";
import { validatePasswordLive } from "@/lib/validatePassword";
import { PasswordValidationResult } from "@/lib/type/passwordValidation";
import api from "@/lib/api";
import GetCredentialsTemplate from "@/components/templates/getCredentials";
import VerifyOTPTemplate from "@/components/templates/verifyOTPTemplate";
import Spinner from "@/lib/spinner";

type ViewState = "FIND_ACCOUNT" | "REGISTER_INIT" | "VERIFY_OTP";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const ranOnce = useRef(false);

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

  // === OAuth code flow ===
  useEffect(() => {
    if (!code || ranOnce.current) return;
    ranOnce.current = true;

    let didRedirectHome = false;

    const handleAuthFlow = async () => {
      try {
        setLoading(true);
        // 1) Exchange code for OAuth data
        const { data: oauthPayload } = await api.post(
          "/api/auth/googleOauth2",
          { code },
          { headers: { "Content-Type": "application/json" } }
        );
        const payload = oauthPayload.user ?? {};
        const { email, provider, provider_user_id, email_verified } = payload;

        if (
          !email ||
          !provider ||
          !provider_user_id ||
          email_verified == null
        ) {
          throw new Error("Missing fields in OAuth response");
        }

        // 2) Register OAuth user
        const regRes = await api.post(
          "/api/auth/register-init-oauth",
          { email, provider, provider_user_id, email_verified },
          { headers: { "Content-Type": "application/json" } }
        );
        if (regRes.status !== 201) {
          setViewState("REGISTER_INIT");
          return;
        }

        // 3) Activate OAuth account
        const activation = await api.post("/api/activate-oauth");
        if (activation.status === 200) {
          didRedirectHome = true;
          router.push("/");
          return;
        }

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
      } finally {
        setLoading(false);
        // clear the code param so the UI returns to normal
        if (!didRedirectHome) {
          setLoading(true);
        }
      }
    };

    handleAuthFlow();
  }, [code, router]);

  // === Credentials sign-up ===
  const handleCredentialsSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error(
        "Bad Request: Passwords don't match. Please double-check and try again.",
        { duration: 2000, style: { fontSize: "16px" }, icon: null }
      );
      setLoading(false);
      return;
    }

    try {
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
        setViewState("FIND_ACCOUNT");
      } else {
        toast.error(
          `${statusCode ?? ""} ${err.response?.statusText ?? err.message}`,
          { duration: 2500, style: { fontSize: "14px" }, icon: null }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // === Password live-validation ===
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
    setPasswordValidation(validatePasswordLive(value));
  };

  // === Loading spinner ===
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spinner />
      </div>
    );
  }

  // === Main UI ===
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
            <p className="text-center text-sm text-gray-600">
              It's free and takes only a minute.
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            <Button
              disabled={false}
              onClick={() => (window.location.href = "/api/auth/googleOauth2")}
              className="flex w-full justify-center gap-2 px-4 py-2 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-50 hover:cursor-pointer transition text-base"
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
              loading={false}
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
                disabled={false}
                onClick={() => router.push("/sign-in")}
                className="flex w-full justify-center gap-2 text-sm px-4 py-2 bg-white font-normal border border-gray-300 hover:bg-gray-50 transition"
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
