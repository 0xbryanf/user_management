import jwt, { Secret } from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
  nonce: string;
  timestamp: number;
}

const secretKey = process.env.JWT_SECRET as string;

export function generateJwt(payload: JwtPayload, expiresIn: "1h"): string {
  if (!secretKey) {
    throw new Error("Secret key is missing or invalid.");
  }

  return jwt.sign(payload, secretKey as Secret, {
    expiresIn: expiresIn
  });
}
