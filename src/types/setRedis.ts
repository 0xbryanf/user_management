export interface SetRedis {
  key: string;
  data: { otp: string; retries: number };
  expiration: number;
}
