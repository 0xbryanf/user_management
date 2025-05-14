import crypto from "crypto";

export function generateNonce(length: number = 16): string {
  return crypto.randomBytes(length).toString("hex");
}
