// /app/api/auth/googleOauth2/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import api from "@/lib/api";
import { createSessionToken } from "@/lib/setJwtCookie";
import { AxiosError } from "axios";

export const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_CLIENT_REDIRECT_URI!
);

export async function GET(request: NextRequest) {
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["openid", "email", "profile"]
  });
  return NextResponse.redirect(authUrl);
}

export async function POST(request: NextRequest) {
  const { code } = (await request.json().catch(() => ({}))) as {
    code?: string;
  };
  if (!code) {
    return NextResponse.json(
      { error: "Missing code in the request body" },
      { status: 400 }
    );
  }

  // 2) Exchange code for tokens
  let tokens;
  try {
    const { tokens: t } = await client.getToken(code);
    tokens = t;
    client.setCredentials(tokens);
  } catch {
    return NextResponse.json(
      { error: "Invalid authorization code" },
      { status: 401 }
    );
  }

  // 3) Verify ID token
  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!
    });
    payload = ticket.getPayload();
  } catch {
    return NextResponse.json({ error: "Invalid ID token" }, { status: 401 });
  }

  if (!payload) {
    return NextResponse.json(
      { error: "Could not parse user information" },
      { status: 500 }
    );
  }

  if (!payload.email_verified) {
    return NextResponse.json({ error: "User not verified." }, { status: 422 });
  }

  const user = {
    email: payload.email,
    provider: payload.iss,
    provider_user_id: payload.sub,
    email_verified: payload.email_verified
  };

  return NextResponse.json(
    {
      user: user
    },
    { status: 200 }
  );
}
