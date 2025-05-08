"use client";

import { FormEvent, useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { signIn } from "next-auth/react";
import Button from "@/components/atoms/button";
import { FcGoogle } from "react-icons/fc";
import SignInForm from "@/components/organisms/signInForm";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

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

    // Optionally, remove query params if needed
    if (callbackUrl) {
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await axios.get("/api/auth/csrf");
        setCsrfToken(res.data.csrfToken);
      } catch (error) {
        throw new Error("Failed to fetch CSRF token");
      }
    };

    fetchCsrfToken();
  }, []);

  const handleCredentialsSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (response?.ok) {
        toast.success(
          "Credentials accepted. Continue to verify your identity.",
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
        toast.error("Invalid credentials. Please try again.", {
          duration: 1000,
          style: { fontSize: "16px" }
        });
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

  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: "/"
    });
  };

  return (
    <>
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
            csrfToken={csrfToken} // Pass csrfToken to LoginForm
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
      <Toaster position="top-center" />
    </>
  );
}
