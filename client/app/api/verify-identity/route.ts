import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { otp } = await request.json();
  const cookieStore = await cookies();
  const payloadref = cookieStore.get("sessiondata")?.value;

  if (!payloadref) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await axios.post(
      "http://localhost:8080/api/v1/verify-otp-email",
      { otp },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payloadref}`
        }
      }
    );

    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    const message = error?.response?.data?.error || "Internal Server Error";
    const status = error?.response?.status || 500;

    return NextResponse.json({ error: message }, { status });
  }
}
