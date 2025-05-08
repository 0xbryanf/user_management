import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { otp } = await request.json();
  if (!otp) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const cookie = request.cookies.get("payloadRef");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = cookie.value;
  let remoteRes: Response;

  try {
    remoteRes = await fetch(`${process.env.BASE_URL}/verify-otp-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        otp: otp
      })
    });
  } catch (err) {
    return NextResponse.json({ error: "Bad Gateway" }, { status: 502 });
  }

  console.log("remoteres", remoteRes);

  if (!remoteRes.ok) {
    return NextResponse.json(
      { error: "Invalid or expired OTP" },
      { status: remoteRes.status }
    );
  }

  return NextResponse.json(
    { status: 200, message: "OTP verified successfully." },
    { status: 200 }
  );
}
