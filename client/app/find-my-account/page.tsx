"use client";
import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import api from "@/lib/api";
import FindMyAccountTemplate from "@/components/templates/findMyAccount";
import NoAccountFoundTemplate from "@/components/templates/noAccountFound";

export default function FindMyAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleGetCredentials = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const apiResponse = await api.get("/api/find-my-account", {
        params: {
          email
        }
      });

      if (apiResponse && apiResponse.status === 200) {
        const fetchedUser = apiResponse.data?.data?.email || null;
        if (!fetchedUser) {
          setIsError(true);
        }

        const otpResponse = await api.post("/api/send-otp-email");
        if (otpResponse.status === 200) {
          router.push("/verify-otp");
        } else {
          toast.error(
            `${otpResponse.data?.status}: ${otpResponse.data?.message}`,
            { duration: 1000, style: { fontSize: "14px" } }
          );
          setLoading(false);
        }
      }
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      const message = `${err.response?.status}: ${err.response?.statusText}`;
      toast.error(message, {
        duration: 2500,
        style: { fontSize: "14px" },
        icon: null
      });
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isError && (
        <FindMyAccountTemplate
          handleGetCredentials={handleGetCredentials}
          loading={loading}
          email={email}
          setEmail={setEmail}
        />
      )}
      {isError && <NoAccountFoundTemplate user={email} />}
      <Toaster position="top-center" />
    </>
  );
}
