import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost:3000", "http://10.5.0.2:3000/"],
};

export default nextConfig;
