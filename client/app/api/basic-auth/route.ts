import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const res = await axios.post("http://localhost:8080/api/v1/verify-user", {
      email,
      password
    });
    if (res.status === 200 && res.data.token) {
      const payloadref = res.data.token;
      const otpResponse = await axios.post(
        "http://localhost:8080/api/v1/send-otp-email",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${payloadref}`
          }
        }
      );
      if (otpResponse.status === 200) {
        const response = NextResponse.json(otpResponse.data, { status: 200 });
        response.cookies.set("sessiondata", payloadref, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 15 // 15 minutes
        });

        return response;
      }
      return NextResponse.json(
        { error: "Failed to send OTP email" },
        { status: otpResponse.status }
      );
    }
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    const message = error?.response?.data?.error || "Internal Server Error";
    const status = error?.response?.status || 500;
    return NextResponse.json({ error: message }, { status });
  }
}
