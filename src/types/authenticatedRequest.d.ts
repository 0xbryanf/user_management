export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}
