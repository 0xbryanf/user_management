import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("payloadRef")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { password } = await request.json();
  if (!password) {
    return NextResponse.json(
      { error: "Bad Request: Password must be provided." },
      { status: 400 }
    );
  }

  const response = await fetch(`${process.env.BASE_URL}/update-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ password })
  });

  if (response.status === 409) {
    return NextResponse.json(
      {
        error:
          "Conflict: This password has already been used. Please use a new one."
      },
      { status: 409 }
    );
  }

  return response.ok
    ? NextResponse.json(
        { message: "Success: Password Updated Successfully." },
        { status: 200 }
      )
    : NextResponse.json(
        { error: "Internal Server Error: An unexpected error occured." },
        { status: response.status }
      );
}
