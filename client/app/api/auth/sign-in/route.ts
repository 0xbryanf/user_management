import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";
import { createSessionToken } from "@/lib/setJwtCookie";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return new NextResponse(null, { status: 400 });
  }
  try {
    const { data } = await api.post(
      `${process.env.BASE_URL}/verify-credential`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    const token = data?.data;
    if (!token) {
      return new NextResponse(null, { status: 401 });
    }
    const sessionToken = await createSessionToken(token, email);
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Bad Request: Missing session token." },
        { status: 400 }
      );
    }
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
    const response = new NextResponse(
      JSON.stringify({
        message: "Accepted: Authentication request set successfully."
      }),
      { status: 202, headers: { "Content-Type": "application/json" } }
    );

    response.headers.set(
      "Set-Cookie",
      `auth.session_token=${sessionToken}; HttpOnly; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }SameSite=Strict; Path=/; Max-Age=${15 * 60}`
    );

    return response;
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
