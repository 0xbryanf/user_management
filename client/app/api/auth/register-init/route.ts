import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { error: "Bad Request: Email and password are required." },
      { status: 400 }
    );
  }

  const res = await fetch(`${process.env.BASE_URL}/register-init-credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const body = await res.json();
  const token = body.data.payloadRef as string;
  if (res.status === 409) {
    const response = NextResponse.json(
      { error: "Conflict: A user with this email already exists." },
      { status: 409 }
    );
    response.cookies.set("payloadRef", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60
    });

    return response;
  }

  if (!res.ok) {
    return NextResponse.json(
      {
        error:
          res.status === 404
            ? "Not Found: Default role not found."
            : "Internal Server Error: An unexpected error occurred."
      },
      { status: res.status }
    );
  }

  const response = NextResponse.json(
    { message: "Created: Credential successfully created." },
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
