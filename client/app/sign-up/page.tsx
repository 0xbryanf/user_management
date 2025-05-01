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
      const response = await axios.post("/api/auth/register", {
        email,
        password
      });

      if (response.status === 200) {
        toast.success(
          "Credentials accepted. Let's verify your identity next.",
          {
            duration: 1500,
            style: { fontSize: "16px" },
            icon: null
          }
        );

        setTimeout(() => {
          router.push("/verify-identity");
        }, 2500);
      } else {
        toast.error("Something went wrong. Please try again.", {
          duration: 1000,
          style: { fontSize: "16px" }
        });
        setLoading(false);
      }
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      const message =
        err.response?.data?.error || "An error occurred. Please try again.";

      toast.error(message, {
        duration: 1000,
        style: { fontSize: "16px" }
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
                : "hover:bg-opacity-30 hover:shadow-sm hover:cursor-pointer"
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

          <p className="mt-10 text-center text-sm text-gray-500">
            Have an account already?{" "}
            <a
              href="/sign-in"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Log in here.
            </a>
          </p>
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
}
