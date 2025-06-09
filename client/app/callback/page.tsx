"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Spinner from "@/lib/spinner";
import { useAuthMethod } from "@/app/contexts/AuthMethodContext";
import api from "@/lib/api";
import { AxiosError } from "axios";
import GetCredentialsTemplate from "../../components/templates/getCredentialsTemplate";
import { useOAuthCode } from "../contexts/OAuthCodeContext";

type View = "LOADING" | "CREDENTIALS_FORM" | "HOME" | "REDIRECT";

export default function CallbackPage() {
  const { setIsOauthLogin } = useAuthMethod();
  const searchParams = useSearchParams();
  const router = useRouter();
  const ranOnce = useRef(false);
  const { setIsConflict } = useOAuthCode();

  const code = searchParams.get("code");
  const [view, setView] = useState<View>("LOADING");

  useEffect(() => {
    if (!code) {
      router.replace("/sign-up");
      return;
    }

    if (ranOnce.current) return;
    ranOnce.current = true;

    const handleOAuthFlow = async () => {
      setIsOauthLogin(true);
      setView("LOADING");

      try {
        const { data: oauthPayload } = await api.post(
          "/api/auth/googleOauth2",
          { code },
          { headers: { "Content-Type": "application/json" } }
        );

        const { user: freshPayload = {} } = oauthPayload;

        if (
          !freshPayload.email ||
          !freshPayload.provider ||
          !freshPayload.provider_user_id
        ) {
          setView("REDIRECT");
          return;
        }

        const regRes = await api.post(
          "/api/auth/register-init-oauth",
          {
            email: freshPayload.email,
            provider: freshPayload.provider,
            provider_user_id: freshPayload.provider_user_id,
            email_verified: freshPayload.email_verified
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (regRes.status === 201) {
          const activation = await api.post("/api/activate-oauth");
          if (activation.status === 200) {
            setView("HOME");
            return;
          }
        }

        setView("REDIRECT");
      } catch (error: unknown) {
        const status = (error as AxiosError).response?.status;

        if (status === 409) {
          setIsConflict(true);
          setView("CREDENTIALS_FORM");
        } else {
          setView("REDIRECT");
        }
      }
    };

    handleOAuthFlow();
  }, [code, router, setIsOauthLogin]);

  useEffect(() => {
    if (view === "REDIRECT") {
      router.replace("/sign-up");
    }

    if (view === "HOME") {
      router.replace("/");
    }
  }, [view, router]);

  if (view === "LOADING") {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  if (view === "CREDENTIALS_FORM") {
    return <GetCredentialsTemplate />;
  }

  return null;
}
