export type Tree = <T extends WorkTreeType>(schema: T) => T;

export type ActionTreeType = {
  [key: string]: any;
};
