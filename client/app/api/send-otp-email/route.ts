// pages/api/send-otp-email.ts
import api from "@/lib/api";
import { fetchAuthorization } from "@/lib/fetchAuthorization";
import { getAuthTokens } from "@/lib/getAuthTokens";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let { token, sessionToken } = await getAuthTokens(request);
  await fetchAuthorization(sessionToken, token);
  try {
    const { status, data } = await api.post(
      `${process.env.BASE_URL}/send-otp-email`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (status !== 200) {
      return NextResponse.json(
        {
          error:
            status === 502
              ? "Bad Gateway: Failed to send OTP Email."
              : data.error ||
                "Internal Server Error: An unexpected error occurred."
        },
        { status }
      );
    }
    return NextResponse.json(
      { message: "Success: OTP Email sent successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log("error", (error as AxiosError).response);
    return new NextResponse(null, { status: 500 });
  }
}
