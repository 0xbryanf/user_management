import { fetchAuthorization } from "@/lib/fetchAuthorization";
import { getAuthTokens } from "@/lib/getAuthTokens";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the password change request for an authenticated user.
 *
 * @param request - The incoming NextRequest containing authentication token and new password
 * @returns A NextResponse with the result of the password change operation
 *
 * - Checks for valid authentication token
 * - Validates password is provided
 * - Sends password update request to backend service
 * - Handles various response scenarios:
 *   - 401 if no token
 *   - 400 if no password provided
 *   - 409 if password has been previously used
 *   - 200 on successful password update
 *   - Fallback error handling for other status codes
 */
export async function POST(request: NextRequest) {
  const { token, sessionToken } = await getAuthTokens(request);
  await fetchAuthorization(sessionToken, token);

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

  const responseBody = await response.json();

  if (response.status === 409) {
    return NextResponse.json(
      {
        error:
          "Conflict: This password has already been used. Please use a new one."
      },
      { status: 409 }
    );
  }

  if (response.ok) {
    return NextResponse.json(
      {
        message: "Success: Password Updated Successfully.",
        data: responseBody.data || null
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      error:
        responseBody.error ||
        "Internal Server Error: An unexpected error occurred."
    },
    { status: response.status }
  );
}
