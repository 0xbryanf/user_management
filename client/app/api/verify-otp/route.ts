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
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
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

  if (!remoteRes.ok) {
    const text = await remoteRes.text().catch(() => remoteRes.statusText);
    return NextResponse.json(
      { error: text || "Request failed." },
      { status: remoteRes.status }
    );
  }

  return NextResponse.json(
    { status: 200, message: "User Verified" },
    { status: 200 }
  );
}
