export type ReturnResponse<T = undefined> = {
  status: number;
  message: string;
  data?: T;
};
