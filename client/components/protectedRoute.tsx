"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const publicPaths = [
  "/sign-in",
  "/sign-up",
  "/api/auth",
  "/public",
  "/callback"
];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Only run session check if there's no `code` in the URL
  useEffect(() => {
    if (code) return;

    const checkSession = async () => {
      try {
        const response = await api.post("/api/get-session");
        if (response.status === 202) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          if (!publicPaths.includes(pathname)) {
            router.replace("/sign-in");
          }
        }
      } catch {
        setIsAuthenticated(false);
        if (!publicPaths.includes(pathname)) {
          router.replace("/sign-in");
        }
      } finally {
        setChecking(false);
      }
    };

    checkSession();
  }, [pathname, router, code]);

  // Redirect authenticated users away from public pages
  useEffect(() => {
    if (!checking && isAuthenticated && publicPaths.includes(pathname)) {
      router.replace("/");
    }
  }, [checking, isAuthenticated, pathname, router]);

  // If we're still checking *or* there's an OAuth code in the URL, show spinner
  // if (checking || code) {
  //   return (

  //   );
  // }

  // Prevent flashing of the public page if already authenticated
  if (isAuthenticated && publicPaths.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
