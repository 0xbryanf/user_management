// lib/getAuthTokens.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getAuthTokens = async (request: NextRequest) => {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    throw new Error("Unauthorized: No cookies provided.");
  }

  // Parse the cookies manually (case-insensitive)
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .map(([key, value]) => [
        key.trim().toLowerCase(),
        decodeURIComponent(value)
      ])
  );

  // Get the JWT token from the cookie (including typo fix)
  const sessionToken = cookies["auth.session_token"];
  if (!sessionToken) {
    throw new Error("Unauthorized: No session token found.");
  }

  try {
    // Verify JWT using secret (more secure than decode)
    const decoded = jwt.verify(
      sessionToken,
      process.env.JWT_SECRET || "your-secret-key" // Replace with your actual secret key
    ) as { id: string };

    return { sessionToken, token: decoded.id };
  } catch (error) {
    throw new Error("Unauthorized: Invalid session token.");
  }
};
