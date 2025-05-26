import { fetchAuthorization } from "@/lib/fetchAuthorization";
import { getAuthTokens } from "@/lib/getAuthTokens";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to find a user's account by email.
 *
 * @param request - The incoming Next.js server request
 * @returns A JSON response containing user data or an error message
 *
 * @remarks
 * - Requires authentication via a 'payloadRef' cookie
 * - Expects an email query parameter
 * - Fetches user credentials from an external API
 * - Handles various error scenarios including unauthorized, bad request, and not found
 */
export async function GET(request: NextRequest) {
  const { token, sessionToken } = await getAuthTokens(request);
  await fetchAuthorization(sessionToken, token);
  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json(
      { error: "Bad Request: Email must be provided." },
      { status: 400 }
    );
  }
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/get-user-accross-entities?email=${encodeURIComponent(email)}`,
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
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: An unexpected error occurred." },
      { status: 500 }
    );
  }
}
