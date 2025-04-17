"use client";

import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import ValidationForm from "@/components/organisms/validationForm";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function basicAuthLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const otp = formData.get("otp") as string;

    try {
      const response = await axios.post("/api/basicAuth", {
        otp
      });

      if (response.status === 200) {
        toast.success("Login successful!", {
          duration: 1000,
          style: { fontSize: "16px" }
        });

        // Delay for better UX before redirect
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } else {
        toast.error("Invalid credentials. Please try again.", {
          duration: 1000,
          style: { fontSize: "16px" }
        });
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Verify your identity
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <ValidationForm onSubmit={basicAuthLogin} loading={loading} />
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
}
