import { TaskType } from "../../../../../types/Project";

export const isSubtask = (task: TaskType) => {
  return !!task.ParentTaskItemId;
};
