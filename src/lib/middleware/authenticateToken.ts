import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { authTokenFromHeader } from "./authTokenFromHeader";
import { findOneCredential } from "lib/helpers/findOneCredential";

/**
 * Interface for JWT payload with userId.
 */
interface AuthPayload extends JwtPayload {
  userId: string;
}

/**
 * Express Request type extended with authenticated user payload.
 */
interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

/**
 * Express middleware to authenticate requests using a JWT from the Authorization header.
 * - Attaches decoded user payload to req.user.
 * - Verifies user existence in the database.
 * - Sends 401 if user not found, 403 for invalid credentials.
 *
 * @param req - Express request extended with user property.
 * @param res - Express response object.
 * @param next - Express next function.
 */
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
