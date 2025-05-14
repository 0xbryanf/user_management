import api from "@/lib/api";
import { fetchAuthorization } from "@/lib/fetchAuthorization";
import { getAuthTokens } from "@/lib/getAuthTokens";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { otp } = await request.json();
  if (!otp) {
    return NextResponse.json(
      { error: "Bad Request: One-Time Pin must be provided." },
      { status: 400 }
    );
  }
  let { token, sessionToken } = await getAuthTokens(request);
  await fetchAuthorization(sessionToken, token);
  let response: Response;
  response = await api.post(
    `${process.env.BASE_URL}/verify-otp-email`,
    { otp: otp },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (response.status === 422) {
    return NextResponse.json(
      { error: "Unprocessable Entity: Invalid or expired OTP." },
      { status: 400 }
    );
  }
  if (response.status === 429) {
    return NextResponse.json(
      {
        error: "Too Many Requests: OTP verification failed too many times."
      },
      { status: 429 }
    );
  }

  if (!response || response.status !== 200) {
    return NextResponse.json(
      {
        error:
          response.status === 404
            ? "Unprocessable Entity: Invalid or expired One-Time Pin."
            : "Internal Server Error: An unexpected error occurred."
      },
      { status: response.status }
    );
  }

  return NextResponse.json(
    { message: "OTP verified successfully." },
    { status: 200 }
  );
}
