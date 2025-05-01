import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    const { otp, token: clientToken } = await request.json();

    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    // Get token from request if not provided in body
    let token = clientToken;
    if (!token) {
      const authToken = await getToken({
        req: request,
        secret: NEXTAUTH_SECRET
      });
      token = authToken?.id;
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await axios.post(
      "http://localhost:8080/api/v1/verify-otp-email",
      { otp },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    const message = error?.response?.data?.message || "Internal Server Error";
    const status = error?.response?.status || 500;
    return NextResponse.json({ error: message }, { status });
  }
}
