import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const REGISTER_INIT_URL = `${process.env.BASE_URL}/register-init`;

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 401 });
  }
  try {
    const res = await axios.post(
      REGISTER_INIT_URL,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json"
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
