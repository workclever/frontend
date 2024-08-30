import { BaseOutput } from "../types/BaseOutput";

export type RtkQueryOutput<T> = {
  meta: unknown;
  payload: BaseOutput<T>;
};
