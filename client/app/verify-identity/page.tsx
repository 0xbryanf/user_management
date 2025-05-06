"use client";

import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import ValidationForm from "@/components/organisms/validationForm";

export default function VerifyIdentityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const otp = formData.get("otp") as string;

    try {
      const response = await axios.post("/api/verify-identity", {
        otp
      });

      if (response.status === 200) {
        toast.success("Login successful!", {
          duration: 1000,
          style: { fontSize: "16px" }
        });

        // Delay for better UX before redirect
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error("Invalid credentials. Please try again.", {
          duration: 1000,
          style: { fontSize: "16px" }
        });
      }
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      const message = `Error ${err.response?.status}: ${err.response?.statusText}`;
      toast.error(message, {
        duration: 2500,
        style: { fontSize: "14px" }
      });
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
          <ValidationForm onSubmit={handleVerification} loading={loading} />
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
}
