import HttpException from "utils/httpException.utl";
import { Request, Response, NextFunction } from "express";

/**
 * Error handling middleware for Express.
 *
 * @param {HttpException} error - The HttpException object containing the error details.
 * @param {Response} res - The Express response object to send the error response.
 */
export const errorHandler = (
  error: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { status, message = "An unexpected error occurred." } = error;
  res.status(status).json({ status, message });
};
