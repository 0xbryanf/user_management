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
      { error: "Email parameter is required." },
      { status: 400, statusText: "Bad Request" }
    );
  }

  let response: Response;
  let fetchedUser: object | undefined;

  try {
    response = await fetch(
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
        { error: "User Not Found" },
        { status: response.status }
      );
    }

    const responseBody = await response.json();
    fetchedUser = responseBody.data;
    if (!fetchedUser) {
      return NextResponse.json({ error: "No user found." }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: "An unexpected error occurred while retrieving the user." },
      { status: 500, statusText: "Internal Server Error" }
    );
  }

  return NextResponse.json(
    { status: 200, message: "User Found", data: fetchedUser },
    { status: 200 }
  );
}
