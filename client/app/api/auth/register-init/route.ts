import api from "@/lib/api";
import { createSessionToken } from "@/lib/setJwtCookie";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Bad Request: Email and password are required." },
        { status: 400 }
      );
    }

    const registerResponse = await api.post(
      `${process.env.BASE_URL}/register-init-credentials`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const token = registerResponse?.data?.data?.payloadRef;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid registration response." },
        { status: 401 }
      );
    }

    const sessionToken = await createSessionToken(token, email);
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Internal Server Error: Session token generation failed." },
        { status: 500 }
      );
    }

    const authResponse = await api.post(
      `${process.env.BASE_URL}/create-authorization`,
      { session: sessionToken },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (authResponse.status !== 201) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid credentials." },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { message: "Accepted: Authentication request set successfully." },
      { status: 201 }
    );

    response.headers.set(
      "Set-Cookie",
      `auth.session_token=${sessionToken}; HttpOnly; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }SameSite=Strict; Path=/; Max-Age=${15 * 60}`
    );

    return response;
  } catch (error) {
    console.error("Error in Authentication:", error);
    return NextResponse.json(
      {
        error:
          "Internal Server Error: Unable to process the authentication request.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
