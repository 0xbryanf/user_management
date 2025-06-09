import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/components/protectedRoute";
import { AuthMethodContextProvider } from "./contexts/AuthMethodContext";
import { OAuthCodeProvider } from "./contexts/OAuthCodeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "BlueFin",
  description:
    "BlueFin is your AI-powered personal assistant that automates tasks, manages your schedule, and delivers real-time insights to boost productivity—anytime, anywhere."
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session}>
          <ProtectedRoute>
            <AuthMethodContextProvider>
              <OAuthCodeProvider>{children}</OAuthCodeProvider>
            </AuthMethodContextProvider>
          </ProtectedRoute>
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
