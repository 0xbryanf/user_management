"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface ProtectedContentProps {
  children: React.ReactNode;
}

export const Providers = ({
  children,
  session
}: {
  children: React.ReactNode;
  session: any;
}) => {
  return (
    <SessionProvider session={session}>
      <ProtectedContent>{children}</ProtectedContent>
    </SessionProvider>
  );
};

export default function ProtectedContent({ children }: ProtectedContentProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const allowedPages = ["/sign-in", "/sign-up", "/public"];
  const allowedAuthAPI = ["/api/auth"];

  useEffect(() => {
    if (
      status === "unauthenticated" &&
      !allowedPages.some((page) => pathname.startsWith(page)) &&
      !allowedAuthAPI.some((api) => pathname.startsWith(api))
    ) {
      router.push("/sign-in");
      return;
    }

    // ✅ If user is authenticated and tries to access the allowed page, redirect
    if (
      status === "authenticated" &&
      (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
    ) {
      router.push("/");
      return;
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      {status === "authenticated" ||
      allowedPages.some((page) => pathname.startsWith(page)) ||
      allowedAuthAPI.some((api) => pathname.startsWith(api))
        ? children
        : null}
    </>
  );
}

// create an auth API that checks external API
// the external API checks if the user is already authenticated in Redis
// the session token is the key and the value is the data about the user like the payloadref, authentication status, userId, email address, role, is active
