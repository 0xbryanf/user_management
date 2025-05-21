import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Extracts and decodes a base64-encoded Bearer JWT from the request's Authorization header.
 * Returns the decoded JWT payload or sends a 401 response if missing/invalid.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns Decoded JWT payload, or sends a 401 response on error
 */
export const authTokenFromHeader = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const tokenBase64 = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  if (!tokenBase64) {
    res.status(401).json({ message: "Access token not provided" });
    return;
  }

  // Decode base64 token back to original JWT
  const token = Buffer.from(tokenBase64, "base64").toString("utf-8");

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  return decoded;
};
