// app/api/set-payload-ref/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles POST requests to set a payload reference token as an HTTP-only secure cookie.
 *
 * @param request - The incoming NextRequest object
 * @returns A NextResponse with a 202 Accepted status and a secure, HTTP-only cookie containing the user's token
 *
 * @throws {NextResponse} Returns a 400 Bad Request if no authentication token is available
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.name || session?.user?.email;

  if (!token) {
    return NextResponse.json(
      { error: "Bad Request: Missing information." },
      { status: 400 }
    );
  }
  const response = NextResponse.json(
    { message: "Accepted: Authentication request set successfully." },
    { status: 202 }
  );
  response.headers.append(
    "Set-Cookie",
    `payloadRef=${token}; HttpOnly; Secure=${
      process.env.NODE_ENV === "production"
    }; SameSite=Strict; Path=/; Max-Age=${15 * 60}`
  );

  return response;
}
