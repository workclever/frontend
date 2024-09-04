import { TaskType } from "./Project";

export type UpdateTaskPropertyParams<
  T extends keyof TaskType = keyof TaskType
> = {
  property: T;
  value: TaskType[T];
};
