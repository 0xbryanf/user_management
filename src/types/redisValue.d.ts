export interface RedisValue<T = undefined> {
  key: string;
  data?: T;
  expiration: number;
}
