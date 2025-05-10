import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get("payloadRef");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = cookie.value;
  let response: Response;

  response = await fetch(`${process.env.BASE_URL}/send-otp-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          response.status === 502
            ? "Bad Gateway: Failed to send OTP Email."
            : "Internal Server Error: An unexpected error occurred."
      },
      { status: response.status }
    );
  }

  return NextResponse.json(
    { message: "Success: OTP Email sent successfully." },
    { status: 200 }
  );
}
