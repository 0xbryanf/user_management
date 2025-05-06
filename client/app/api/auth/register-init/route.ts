import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Required fields missing." },
      { status: 400, statusText: "Bad Request" }
    );
  }

  // 1) forward to your backend
  const res = await fetch(`${process.env.BASE_URL}/register-init-credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res?.ok) {
    return NextResponse.json(
      { error: res?.statusText || "Internal Server Error" },
      { status: res?.status || 500 }
    );
  }

  // 2) parse out your payloadRef
  const body = await res.json();
  const token = body.data.payloadRef as string;

  // 3) build the NextResponse and set the HTTP-only cookie
  const response = NextResponse.json(
    { status: 201, message: "Created" },
    { status: 201 }
  );

  response.cookies.set("payloadRef", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60
  });

  return response;
}
