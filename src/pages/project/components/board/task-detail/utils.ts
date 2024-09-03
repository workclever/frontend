import { TaskType } from "@app/types/Project";

export const isSubtask = (task: TaskType) => {
  return !!task.ParentTaskItemId;
};
