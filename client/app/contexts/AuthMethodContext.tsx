"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from "react";

interface AuthMethodContextInterface {
  isOauthLogin: boolean;
  setIsOauthLogin: Dispatch<SetStateAction<boolean>>;
}

const AuthMethodContext = createContext<AuthMethodContextInterface | undefined>(
  undefined
);

export function AuthMethodContextProvider({
  children
}: {
  children: ReactNode;
}) {
  const [isOauthLogin, setIsOauthLogin] = useState(false);
  return (
    <AuthMethodContext.Provider value={{ isOauthLogin, setIsOauthLogin }}>
      {children}
    </AuthMethodContext.Provider>
  );
}

export function useAuthMethod() {
  const ctx = useContext(AuthMethodContext);
  if (!ctx) {
    throw new Error("useAuthMethod must be used within AuthMethodProvider");
  }
  return ctx;
}
