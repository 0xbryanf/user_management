import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { otp } = await request.json();
  if (!otp) {
    return NextResponse.json(
      { error: "Bad Request: One-Time Pin must be provided." },
      { status: 400 }
    );
  }

  const cookie = request.cookies.get("payloadRef");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = cookie.value;
  let response: Response;
  response = await fetch(`${process.env.BASE_URL}/verify-otp-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      otp: otp
    })
  });

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

  if (!response.ok) {
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
