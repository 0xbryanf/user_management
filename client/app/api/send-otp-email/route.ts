import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get("payloadRef");
  if (!cookie) {
    return NextResponse.json(
      { error: "Invalid Credentials.", statusText: "Unauthorized" },
      { status: 401 }
    );
  }
  const token = cookie.value;

  let remoteRes: Response;
  try {
    remoteRes = await fetch(`${process.env.BASE_URL}/send-otp-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    return NextResponse.json(
      { error: "OTP service unreachable." },
      { status: 502, statusText: "Bad Gateway" }
    );
  }

  // 3) Handle a non-2xx from the remote service
  if (!remoteRes.ok) {
    const text = await remoteRes.text().catch(() => remoteRes.statusText);
    return NextResponse.json(
      { error: text || "OTP service error" },
      { status: remoteRes.status }
    );
  }

  // 4) Only one successful response
  return NextResponse.json(
    { status: 200, message: "OTP Sent" },
    { status: 200 }
  );
}
