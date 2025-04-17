"use client";

import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import LoginForm from "@/components/organisms/loginForm";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function basicAuthLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      const response = await axios.post("/api/basicAuth", {
        email,
        password
      });

      if (response.status === 200) {
        toast.success("Credentials accepted. Continue to verify your identity.", {
          duration: 1500,
          style: { fontSize: "16px" },
          icon: null
        });

        setTimeout(() => {
          router.push("/validate/123");
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
      const message = err.response?.data?.message || "An error occurred. Please try again.";

      console.error("Login error:", err);

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
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <LoginForm onSubmit={basicAuthLogin} loading={loading} />

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
