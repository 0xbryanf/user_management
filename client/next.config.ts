import type { NextConfig } from "next";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_SECRET: NEXTAUTH_SECRET
  },
  allowedDevOrigins: ["http://localhost:3000", "http://10.5.0.2:3000/"]
};

export default nextConfig;
