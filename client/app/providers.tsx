"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

export const Providers = ({
  children,
  session
}: {
  children: React.ReactNode;
  session: any;
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
