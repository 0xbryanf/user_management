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

  try {
    const { token, sessionToken } = await getAuthTokens(request);
    await fetchAuthorization(sessionToken, token);

    const [response, sessionActivationResponse, userActivationResponse] =
      await Promise.all([
        api.post(
          `${process.env.BASE_URL}/verify-otp-email`,
          { otp: otp },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        ),
        api.post(
          `${process.env.BASE_URL}/activate-authorization`,
          { key: sessionToken },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        ),
        api.post(
          `${process.env.BASE_URL}/activate-user`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        )
      ]);

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
        { status: response.status || 500 }
      );
    }

    if (!userActivationResponse || userActivationResponse.status !== 200) {
      return NextResponse.json(
        {
          error:
            userActivationResponse.status === 404
              ? "Not Found: User not found."
              : "Internal Server Error: An unexpected error occurred."
        },
        { status: response.status || 500 }
      );
    }

    if (sessionActivationResponse.status !== 200) {
      return NextResponse.json(
        { error: "Failed to activate authorization." },
        { status: sessionActivationResponse.status }
      );
    }

    return NextResponse.json(
      { message: "OTP verified and authorization activated successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error: Failed to process the request.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
