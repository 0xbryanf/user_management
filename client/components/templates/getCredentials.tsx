"use client";
import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { toast, Toaster } from "react-hot-toast";
import api from "@/lib/api";
import FindMyAccountTemplate from "@/components/templates/findMyAccount";
import NoAccountFoundTemplate from "@/components/templates/noAccountFound";
import VerifyOTPTemplate from "./verifyOTPTemplate";

// Define view states for better control
type ViewState = "FIND_ACCOUNT" | "NO_ACCOUNT_FOUND" | "VERIFY_OTP";

const GetCredentialsTemplate = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("FIND_ACCOUNT");

  const handleGetCredentials = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const apiResponse = await api.get("/api/find-my-account", {
        params: { email }
      });

      if (apiResponse && apiResponse.status === 200) {
        const fetchedUser = apiResponse.data?.data?.email || null;
        if (!fetchedUser) {
          setViewState("NO_ACCOUNT_FOUND");
          return;
        }

        const otpResponse = await api.post("/api/send-otp-email");
        if (otpResponse.status === 200) {
          setViewState("VERIFY_OTP");
        } else {
          toast.error(
            `${otpResponse.data?.status}: ${otpResponse.data?.message}`,
            { duration: 1000, style: { fontSize: "14px" } }
          );
        }
      } else {
        setViewState("NO_ACCOUNT_FOUND");
      }
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      const message = `${err.response?.status}: ${err.response?.statusText}`;
      toast.error(message, {
        duration: 2500,
        style: { fontSize: "14px" },
        icon: null
      });
      setViewState("NO_ACCOUNT_FOUND");
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
      <Toaster position="top-center" />
    </>
  );
};

export default GetCredentialsTemplate;
