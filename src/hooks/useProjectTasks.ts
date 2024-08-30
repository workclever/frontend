import React from "react";
import { useSelector } from "react-redux";
import { useListProjectTasksQuery } from "../services/api";
import { selectSelectedProjectId } from "../slices/project/projectSlice";
import { TaskType } from "../types/Project";

export const useProjectTasks = (): { [key: number]: TaskType } => {
  const selectedProjectId = useSelector(selectSelectedProjectId);

  const { data: tasks, isLoading: isTasksLoading } = useListProjectTasksQuery(
    Number(selectedProjectId),
    {
      skip: !selectedProjectId,
    }
  );

  const tasksMapInit: { [key: number]: TaskType } = {};
  const tasksMap = React.useMemo(
    () =>
      (tasks?.Data || []).reduce((acc, cur) => {
        acc[cur.Id] = cur;
        return acc;
      }, tasksMapInit),
    [tasks, tasksMapInit]
  );

  if (isTasksLoading) {
    return {};
  }

  return tasksMap;
};
