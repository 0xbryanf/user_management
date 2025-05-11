import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the POST request to send an OTP email.
 *
 * @param request - The incoming Next.js server request
 * @returns A JSON response indicating the status of the OTP email sending process
 *
 * @throws {NextResponse} Returns an error response if:
 * - Authentication token is missing (401)
 * - Email sending service encounters an error (502 or other status)
 * - An unexpected internal server error occurs (500)
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("payloadRef")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing authentication token." },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.BASE_URL}/send-otp-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const responseBody = await response.json().catch(() => ({})); // Avoid crashing on invalid JSON
      return NextResponse.json(
        {
          error:
            response.status === 502
              ? "Bad Gateway: Failed to send OTP Email."
              : responseBody.error ||
                "Internal Server Error: An unexpected error occurred."
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Success: OTP Email sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: An unexpected error occurred." },
      { status: 500 }
    );
  }
}
