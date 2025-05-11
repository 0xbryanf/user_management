// app/api/set-payload-ref/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.name || session?.user?.email;

  if (!token) {
    return NextResponse.json(
      { error: "Bad Request: Missing information." },
      { status: 400 }
    );
  }

  // Create a new response and set the cookie directly on it
  const response = NextResponse.json(
    { message: "Accepted: Authentication request set successfully." },
    { status: 202 }
  );

  // Set the payloadRef cookie directly on the response
  response.headers.append(
    "Set-Cookie",
    `payloadRef=${token}; HttpOnly; Secure=${
      process.env.NODE_ENV === "production"
    }; SameSite=Strict; Path=/; Max-Age=${15 * 60}`
  );

  return response;
}
