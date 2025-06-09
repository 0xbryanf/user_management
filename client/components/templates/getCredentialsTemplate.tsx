"use client";
import { FormEvent, useState, useEffect } from "react";
import { AxiosError } from "axios";
import { toast, Toaster } from "react-hot-toast";
import api from "@/lib/api";
import FindMyAccountTemplate from "@/components/templates/findMyAccount";
import NoAccountFoundTemplate from "@/components/templates/noAccountFound";
import VerifyOTPTemplate from "./verifyOTPTemplate";
import { useOAuthCode } from "@/app/contexts/OAuthCodeContext";
import { useRouter } from "next/navigation";

type ViewState = "FIND_ACCOUNT" | "NO_ACCOUNT_FOUND" | "VERIFY_OTP";

const GetCredentialsTemplate = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("FIND_ACCOUNT");
  const { isConflict } = useOAuthCode();

  const handleGetCredentials = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // 1) lookup account
    try {
      const apiResponse = await api.get("/api/find-my-account", {
        params: { email }
      });

      if (apiResponse.status !== 200 || !apiResponse.data?.data?.email) {
        setViewState("NO_ACCOUNT_FOUND");
        return;
      }
    } catch (err) {
      const e = err as AxiosError<{ error?: string }>;
      toast.error(`${e.response?.status} ${e.response?.data?.error}`, {
        duration: 2500,
        style: { fontSize: "14px" },
        icon: null
      });
      setViewState("NO_ACCOUNT_FOUND");
      setLoading(false);
      return;
    }

    // 2) send OTP
    try {
      const otpResponse = await api.post("/api/send-otp-email", { email });
      if (otpResponse.status === 200) {
        setViewState("VERIFY_OTP");
      } else {
        toast.error(otpResponse.data?.message || "Failed to send OTP", {
          duration: 2500,
          style: { fontSize: "14px" },
          icon: null
        });
      }
    } catch (err) {
      const e = err as AxiosError;
      toast.error(
        `${e.response?.status ?? ""} ${e.response?.statusText ?? e.message}`,
        { duration: 2500, style: { fontSize: "14px" }, icon: null }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {viewState === "FIND_ACCOUNT" && (
        <FindMyAccountTemplate
          handleGetCredentials={handleGetCredentials}
          loading={loading}
          email={email}
          setEmail={setEmail}
        />
      )}
      {viewState === "NO_ACCOUNT_FOUND" && (
        <NoAccountFoundTemplate user={email} />
      )}
      {viewState === "VERIFY_OTP" && <VerifyOTPTemplate />}
      <Toaster />
    </>
  );
};

export default GetCredentialsTemplate;
