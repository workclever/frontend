import { BoardFilters } from "@app/slices/board/boardSlice";
import { TaskType } from "@app/types/Project";

const filterTasksByText = (tasks: TaskType[], filterText: string) => {
  const trimmedFilter = filterText.trim().toLowerCase();
  return tasks.filter(
    (task) =>
      task.Title.toLowerCase().includes(trimmedFilter) ||
      task.Slug.toLowerCase().includes(trimmedFilter)
  );
};

const filterTasksByUsers = (tasks: TaskType[], userIds: number[]) =>
  tasks.filter(
    (task) =>
      task.AssigneeUserIds.some((id) => userIds.includes(id)) ||
      userIds.includes(task.ReporterUserId)
  );

export const applyBoardFilters = (tasks: TaskType[], filters: BoardFilters) => {
  let filteredTasks = tasks;
  if (filters.filterText) {
    filteredTasks = filterTasksByText(filteredTasks, filters.filterText);
  }
  if (filters.userIds && filters.userIds.length > 0) {
    filteredTasks = filterTasksByUsers(filteredTasks, filters.userIds);
  }
  return filteredTasks;
};
