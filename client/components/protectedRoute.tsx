"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Spinner from "@/lib/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const publicPaths = ["/sign-in", "/sign-up", "/api/auth", "/public"];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.post("/api/get-session");
        if (response.status === 202) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // If not 202, redirect to a public path
          if (!publicPaths.includes(pathname)) {
            router.replace("/sign-in");
          }
        }
      } catch {
        setIsAuthenticated(false);
        // On error, redirect to public path if not already there
        if (!publicPaths.includes(pathname)) {
          router.replace("/sign-in");
        }
      } finally {
        setChecking(false);
      }
    };
    checkSession();
  }, [pathname, router]);

  useEffect(() => {
    // If authenticated and on a public path, redirect to home
    if (!checking && isAuthenticated && publicPaths.includes(pathname)) {
      router.replace("/");
    }
  }, [checking, isAuthenticated, pathname, router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spinner />
      </div>
    );
  }

  // Prevent flashing the public page content while redirecting
  if (isAuthenticated && publicPaths.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
