import { NextFunction, Request, Response } from "express";
/**
 * Express middleware to prevent multiple responses from being sent for a single request.
 * Logs an error if res.send, res.json, or res.end are called more than once.
 */
export const responseGuardMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  let isResponseSent = false;
  const originalSend = res.send.bind(res);
  res.send = (...args: any[]) => {
    if (isResponseSent) {
      console.error("Attempted to send a response after it was already sent.");
      return res;
    }

    isResponseSent = true;
    return originalSend(...args);
  };

  const originalJson = res.json.bind(res);
  res.json = (body?: any) => {
    if (isResponseSent) {
      console.error(
        "⚠️ Attempted to send a JSON response after it was already sent."
      );
      return res;
    }

    isResponseSent = true;
    return originalJson(body);
  };

  const originalEnd = res.end.bind(res);
  res.end = ((chunk?: any, encoding?: any, cb?: any): Response => {
    if (isResponseSent) {
      console.error("Attempted to end response after it was already ended.");
      return res;
    }

    isResponseSent = true;

    if (typeof chunk === "function") {
      return originalEnd(chunk);
    } else if (typeof encoding === "function") {
      return originalEnd(chunk, encoding);
    } else {
      return originalEnd(chunk, encoding, cb);
    }
  }) as typeof res.end;

  next();
};
