import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import api from "@/lib/api";
import { AxiosError } from "axios";

function getCookie(cookieHeader: string, name: string): string | undefined {
  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function POST(request: NextRequest) {
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
      { error: "Unauthorized: No session token found." },
      { status: 401 }
    );
  }

  let token: string;
  try {
    const decoded = jwt.verify(
      sessionToken,
      process.env.JWT_SECRET as string
    ) as { id: string };
    token = decoded.id;
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: Invalid session token." },
      { status: 401 }
    );
  }

  try {
    // Step 1: Get authorization data from Redis
    const authRes = await api.post(
      `${process.env.BASE_URL}/get-authorization`,
      { key: sessionToken },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const authData = authRes?.data?.data;
    const isAuthorized = authData?.isAuthorize;
    const hasIsActive = Object.prototype.hasOwnProperty.call(
      authData,
      "isActive"
    );

    let isActive = authData?.isActive;
    if (!hasIsActive) {
      const userActiveRes = await api.post(
        `${process.env.BASE_URL}/verify-user-activation`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      isActive = userActiveRes?.data?.data;

      if (typeof isActive === "boolean") {
        const updatedAuthData = {
          key: sessionToken,
          userId: authData?.userId,
          authorizationToken: token,
          isAuthorize: isAuthorized,
          expiration: authData?.expiration,
          isActive,
          roles: []
        };

        await api.post(
          `${process.env.BASE_URL}/update-user-authorization`,
          { authData: updatedAuthData },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
    }

    if (!isAuthorized || !isActive) {
      return NextResponse.json({ message: "No Permission" }, { status: 403 });
    }

    return NextResponse.json(
      { message: "User is authenticated." },
      { status: 202 }
    );
  } catch (error: unknown) {
    const err = error as AxiosError;
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err.response?.data || err.message || "Unknown error"
      },
      { status: err.response?.status || 500 }
    );
  }
}
