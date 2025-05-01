"use client";
import ConfirmIdentityForm from "@/components/organisms/confirmIdentityForm";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function ConfirmIdentity() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;
    const base64 = id.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    setToken(decoded);
  }, [token]);

  const handleConfirmation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const otp = formData.get("otp") as string;

    try {
      const response = await axios.post("/api/verify-identity", {
        otp,
        token
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
      const message =
        err.response?.data?.error || "An error occurred. Please try again.";

      toast.error(message, {
        duration: 1000,
        style: { fontSize: "16px" }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Confirm your identity
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <ConfirmIdentityForm
            onSubmit={handleConfirmation}
            loading={loading}
          />
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
}
