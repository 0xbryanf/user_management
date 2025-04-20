import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { authTokenFromHeader } from "./authTokenFromHeader";

interface AuthPayload extends JwtPayload {
  userId: string;
}

interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    req.user = authTokenFromHeader(req, res) as AuthPayload;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid credentials" });
  }
}
