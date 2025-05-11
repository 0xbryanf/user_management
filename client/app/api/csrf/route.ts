import { NextResponse } from "next/server";
import CSRF from "csrf";

const csrf = new CSRF();
const secret = "abcd123";

export async function GET() {
  try {
    const csrfToken = await csrf.create(secret);
    return NextResponse.json({ csrfToken }, { status: 200 });
  } catch (error) {
    console.error("Error generating CSRF token:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Failed to generate CSRF token." },
      { status: 500 }
    );
  }
}
