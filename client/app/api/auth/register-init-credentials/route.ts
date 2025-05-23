import api from "@/lib/api";
import { createSessionToken } from "@/lib/setJwtCookie";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  try {
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

    const finalResponse = NextResponse.json(
      { message: "Accepted: Authentication request set successfully." },
      { status: 201 }
    );

    finalResponse.headers.set(
      "Set-Cookie",
      `auth.session_token=${sessionToken}; HttpOnly; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }SameSite=Strict; Path=/; Max-Age=${15 * 60}`
    );

    return finalResponse;
  } catch (error: unknown) {
    const err = error as AxiosError<{ data?: { payloadRef?: string } }>;
    if (err.response?.status === 409) {
      const token = err.response.data?.data?.payloadRef;
      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid registration response." },
          { status: 401 }
        );
      }

      const sessionToken = await createSessionToken(token, email);
      const { status } = await api.post(
        `${process.env.BASE_URL}/create-authorization`,
        { session: sessionToken },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (status != 201) {
        return NextResponse.json(
          { error: "Invalid Credentials." },
          { status: 401 }
        );
      }
      const conflictResponse = NextResponse.json(
        { message: "Conflict: The request could not be completed." },
        { status: 409 }
      );

      conflictResponse.headers.set(
        "Set-Cookie",
        `auth.session_token=${sessionToken}; HttpOnly; ${
          process.env.NODE_ENV === "production" ? "Secure; " : ""
        }SameSite=Strict; Path=/; Max-Age=${15 * 60}`
      );

      return conflictResponse;
    }
    return NextResponse.json(
      {
        error: "Internal Server Error: Unable to process the request.",
        details: err.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
