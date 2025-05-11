import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

/**
 * Handles authentication routes for NextAuth.js
 * Supports both GET and POST methods for authentication flow
 * Uses the predefined authentication options from the application's auth configuration
 */
const handler = NextAuth({ ...authOptions });

export { handler as GET, handler as POST };
