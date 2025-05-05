import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Extracts and verifies a signed token from the Authorization header.
 * Expected format: "Authorization: Sig <token>"
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Decoded JWT payload or sends an HTTP response on error
 */
export const signedTokenFromHeader = (
  req: Request,
  res: Response
): JwtPayload | void => {
  const authHeader = req.headers.authorization;

  const signedToken =
    authHeader?.startsWith("Sig ") && authHeader.split(" ")[1];

  if (!signedToken) {
    res.status(400).json({
      statusText: "Bad Request",
      message: "Missing access token."
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      signedToken,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;

    return decoded;
  } catch (err) {
    res.status(401).json({
      statusText: "Unauthorized",
      message: "Invalid or expired token."
    });
  }
};
