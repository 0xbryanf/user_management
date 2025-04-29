import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const REGISTER_INIT_URL = `${process.env.BASE_URL}/register-init-credentials`;

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

    if (res.status === 201) {
      return NextResponse.json(
        { payloadRef: res.data?.payloadRef },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: res.data?.message },
        { status: res.status }
      );
    }
  } catch (error: any) {
    const message = error?.response?.data?.message || "Internal Server Error";
    const status = error?.response?.data?.status || 500;
    return NextResponse.json({ error: message }, { status });
  }
}
