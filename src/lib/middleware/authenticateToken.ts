import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY!;

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  const tokenFromQuery =
    typeof req.query.token === "string" ? req.query.token : undefined;

  const tokenFromBody =
    typeof req.body?.token === "string" ? req.body.token : undefined;

  const token = tokenFromHeader || tokenFromQuery || tokenFromBody;

  if (!token) {
    res.status(401).json({ message: "Access token not provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid credentials" });
  }
}
