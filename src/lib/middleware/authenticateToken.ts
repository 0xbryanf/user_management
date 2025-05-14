import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { authTokenFromHeader } from "./authTokenFromHeader";
import { findOneCredential } from "lib/helpers/findOneCredential";

interface AuthPayload extends JwtPayload {
  userId: string;
}

interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    req.user = authTokenFromHeader(req, res) as AuthPayload;

    const user = await findOneCredential({ userId: req.user?.userId });

    if (!user) {
      res
        .status(401)
        .json({ statusText: "Unauthorized", message: "User not found" });
      return;
    }

    next();
  } catch (error) {
    if (!res.headersSent) {
      res
        .status(403)
        .json({ statusText: "Forbidden", message: "Invalid credentials" });
      return;
    }
  }
}
