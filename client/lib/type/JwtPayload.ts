export interface JwtPayload {
  id: string;
  email: string;
  nonce: string;
  timestamp: number;
}
