export type ReturnResponse<T = undefined> = {
  status: number;
  statusText: string;
  message: string;
  data?: T;
};
