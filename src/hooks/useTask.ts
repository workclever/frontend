import { useGetTaskQuery } from "../services/api";
import { useProjectTasks } from "./useProjectTasks";

export const useTask = (taskId?: number | null) => {
  const { tasks, isTasksLoading } = useProjectTasks();
  const foundInTasks = tasks?.find((r) => r.Id === taskId);

  const { data, isLoading } = useGetTaskQuery(Number(taskId), {
    skip: !taskId || !!foundInTasks,
  });

  const foundTask = data?.Data;

  return {
    task: foundInTasks || foundTask,
    isLoading: isTasksLoading || isLoading,
  };
};
