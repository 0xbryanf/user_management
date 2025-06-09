"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction
} from "react";
import { useSearchParams } from "next/navigation";

interface OAuthCodeContextValue {
  code: string;
  isConflict: boolean;
  setIsConflict: Dispatch<SetStateAction<boolean>>;
  payload: {
    email: string;
    provider: string;
    provider_user_id: string;
    email_verified: boolean;
  };
  setPayload: Dispatch<
    SetStateAction<{
      email: string;
      provider: string;
      provider_user_id: string;
      email_verified: boolean;
    }>
  >;
}

const OAuthCodeContext = createContext<OAuthCodeContextValue | undefined>(
  undefined
);

export function OAuthCodeProvider({ children }: { children: ReactNode }) {
  const [isConflict, setIsConflict] = useState(false);
  const [payload, setPayload] = useState({
    email: "",
    provider: "",
    provider_user_id: "",
    email_verified: false
  });
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string>(
    () => searchParams.get("code") ?? ""
  );

  useEffect(() => {
    const param = searchParams.get("code");
    if (param) setCode(param);
  }, [searchParams]);

  return (
    <OAuthCodeContext.Provider
      value={{ code, isConflict, setIsConflict, payload, setPayload }}
    >
      {children}
    </OAuthCodeContext.Provider>
  );
}

export function useOAuthCode(): OAuthCodeContextValue {
  const ctx = useContext(OAuthCodeContext);
  if (!ctx) {
    throw new Error("useOAuthCode must be used within an OAuthCodeProvider");
  }
  return ctx;
}
