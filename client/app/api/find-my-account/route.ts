import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("payloadRef");
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = cookie.value;
  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json(
      { error: "Bad Request: Email must be provided." },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${process.env.BASE_URL}/get-credential-by-email?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          response.status === 404
            ? "Not Found: Unable to find user."
            : "Internal Server Error: An unexpected error occurred."
      },
      { status: response.status }
    );
  }

  const responseBody = await response.json();
  const fetchedUser = responseBody?.data;

  if (!fetchedUser) {
    return NextResponse.json(
      { error: "Not Found: User not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: "Success: User found.",
      data: fetchedUser
    },
    { status: 200 }
  );
}
