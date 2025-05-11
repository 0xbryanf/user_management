import { NextRequest, NextResponse } from "next/server";

/**
 * Handles user registration initialization via POST request
 *
 * @param request - The incoming NextRequest containing user registration credentials
 * @returns A NextResponse with registration status, including potential error handling for email conflicts, invalid inputs, or server errors
 */
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
  const token = body.data?.payloadRef as string;

  if (res.status === 409) {
    const response = NextResponse.json(
      { error: "Conflict: A user with this email already exists." },
      { status: 409 }
    );

    response.headers.append(
      "Set-Cookie",
      `payloadRef=${token}; HttpOnly; Secure=${
        process.env.NODE_ENV === "production"
      }; SameSite=Strict; Path=/; Max-Age=${15 * 60}`
    );

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

  response.headers.append(
    "Set-Cookie",
    `payloadRef=${token}; HttpOnly; Secure=${
      process.env.NODE_ENV === "production"
    }; SameSite=Strict; Path=/; Max-Age=${15 * 60}`
  );

  return response;
}
