import { useGetTaskQuery } from "../services/api";
import { useProjectTasks } from "./useProjectTasks";

export const useTask = (taskId?: number | null) => {
  const tasks = useProjectTasks();
  const foundInTasks = tasks[taskId as number];

  const { data } = useGetTaskQuery(Number(taskId), {
    skip: !taskId || !!foundInTasks,
  });

  const foundTask = data?.Data;

  return foundInTasks || foundTask;
};
