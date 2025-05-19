import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import api from "@/lib/api";

function getCookie(cookieHeader: string, name: string) {
  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(name + "="))
    ?.split("=")[1];
}

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json(
        { error: "Unauthorized: No cookies provided." },
        { status: 401 }
      );
    }

    const sessionToken = getCookie(cookieHeader, "auth.session_token");
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Unauthorized: No session token cookie found." },
        { status: 401 }
      );
    }

    // The rest of your logic...
    const decoded = jwt.verify(
      sessionToken,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { id: string };
    const token = decoded.id;

    const [authRes, userActiveRes] = await Promise.all([
      api.post(
        `${process.env.BASE_URL}/get-authorization`,
        { key: sessionToken },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      ),
      api.post(
        `${process.env.BASE_URL}/verify-user-activation`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      )
    ]);

    const userIsAuthorized = authRes?.data?.data?.isAuthorize;
    const userIsActive = userActiveRes?.data?.data;

    if (!userIsAuthorized || !userIsActive) {
      return NextResponse.json({ message: "No Permission" }, { status: 403 });
    }

    if (userIsAuthorized && userIsActive) {
      return NextResponse.json(
        { message: "User is authenticated." },
        { status: 202 }
      );
    }

    return NextResponse.json(
      {
        message: "Success: User is active.",
        data: userActiveRes.data,
        auth: authRes.data
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Internal Server Error: Unable to process the request.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
