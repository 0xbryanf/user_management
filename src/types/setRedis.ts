export interface SetOTPRedis {
  key: string;
  data: { otp: string; retries: number };
  expiration: number;
}
