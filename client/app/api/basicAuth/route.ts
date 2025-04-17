import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    console.log('email: ', email);
    console.log('password: ', password);

    // Fake login logic (replace with real check)
    if (email === "test@example.com") {
        return new Response(JSON.stringify({ message: "Login successful!" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } else {
        return new Response(JSON.stringify({ message: "Invalid credentials" }), {
            status: 401,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
