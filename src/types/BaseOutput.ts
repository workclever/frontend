export type BaseOutput<T> = {
  Succeed: boolean;
  Message: string;
  Data: T;
};
