import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authTokenFromHeader = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  if (!tokenFromHeader) {
    res.status(401).json({ message: "Access token not provided" });
    return;
  }

  const decoded = jwt.verify(
    tokenFromHeader as string,
    process.env.JWT_SECRET_KEY!
  ) as JwtPayload;

  if (!decoded) {
    throw new Error("Invalid token");
  }

  return decoded;
};
