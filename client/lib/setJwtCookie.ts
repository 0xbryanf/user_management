import { generateNonce } from "./generateNonce";
import { generateJwt } from "./generateJwt";

// Ensure the secretKey is loaded and properly typed
const secretKey = process.env.JWT_SECRET as string;
if (!secretKey) {
  throw new Error("JWT secret key is missing.");
}

/**
 * Sets a secure JWT cookie on the response.
 * @param response - The NextResponse object.
 * @param id - User ID.
 * @param email - User email.
 * @param expiresIn - JWT expiration time (default: "1h").
 * @returns The modified NextResponse with the JWT cookie set.
 */
export async function createSessionToken(
  id: string,
  email: string
): Promise<string> {
  const nonce = generateNonce(16);
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = {
    id,
    email,
    nonce,
    timestamp
  };
  const sessionToken = generateJwt(payload, "1h");
  return sessionToken;
}
