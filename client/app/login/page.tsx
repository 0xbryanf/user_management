"use client";

import { FormEvent, useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import LoginForm from "@/components/organisms/loginForm";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState(""); // Added state for csrfToken

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

  const handleCredentialsLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (response) {
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
      const err = error as AxiosError<{ message?: string }>;

      const status = err.response?.status;
      const message =
        err.response?.data?.message || "An error occurred. Please try again.";

      if (status === 401) {
        toast.error("Invalid credentials. Please try again.", {
          duration: 1000,
          style: { fontSize: "16px" }
        });
      } else if (status === 405) {
        toast.error("Method not allowed.", {
          duration: 1000,
          style: { fontSize: "16px" }
        });
      } else {
        toast.error(message, {
          duration: 1000,
          style: { fontSize: "16px" }
        });
      }

      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <LoginForm
            onSubmit={handleCredentialsLogin}
            loading={loading}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            csrfToken={csrfToken} // Pass csrfToken to LoginForm
          />

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Sign up now while it's still free!
            </a>
          </p>
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
}
