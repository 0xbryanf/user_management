import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No active session." },
      { status: 401 }
    );
  }
  const cookies = request.cookies;
  const sessionToken = cookies.get("auth.session_token")?.value;

  if (!sessionToken) {
    return null;
  }

  return NextResponse.json(
    {
      message: "Session Token Retrieved Successfully.",
      sessionToken
    },
    { status: 200 }
  );
}
