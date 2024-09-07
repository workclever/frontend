import { useSelector } from "react-redux";
import { useListProjectTasksQuery } from "../services/api";
import { selectSelectedProjectId } from "../slices/project/projectSlice";

export const useProjectTasks = () => {
  const selectedProjectId = useSelector(selectSelectedProjectId);

  const { data: tasks, isLoading: isTasksLoading } = useListProjectTasksQuery(
    Number(selectedProjectId),
    {
      skip: !selectedProjectId,
    }
  );

  if (isTasksLoading) {
    return {};
  }

  return {
    tasks: tasks?.Data || [],
    isTasksLoading,
  };
};
