import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Fake login logic (replace with real check)
  if (email === "test@example.com" && password === "password") {
    return new Response(
      JSON.stringify({ message: "User verified successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } else {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
