import api from "@/lib/api";
import { fetchAuthorization } from "@/lib/fetchAuthorization";
import { getAuthTokens } from "@/lib/getAuthTokens";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token, sessionToken } = await getAuthTokens(request);
    await fetchAuthorization(sessionToken, token);

    const [sessionActivationResponse, userActivationResponse] =
      await Promise.all([
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

    if (!userActivationResponse || userActivationResponse.status !== 200) {
      return NextResponse.json(
        {
          error:
            userActivationResponse.status === 404
              ? "Not Found: User not found."
              : "Internal Server Error: An unexpected error occurred."
        },
        { status: userActivationResponse.status || 500 }
      );
    }

    if (sessionActivationResponse.status !== 200) {
      return NextResponse.json(
        { error: "Failed to activate authorization." },
        { status: sessionActivationResponse.status }
      );
    }

    return NextResponse.json(
      { message: "Authorization and user activated successfully." },
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
