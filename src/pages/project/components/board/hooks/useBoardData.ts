import React from "react";
import { useSelector } from "react-redux";

import {
  useListCustomFieldsQuery,
  useListProjectTasksQuery,
} from "@app/services/api";
import { useAppNavigate } from "@app/hooks/useAppNavigate";
import { useBoards } from "@app/hooks/useBoards";
import { useColumns } from "@app/hooks/useColumns";
import {
  selectSelectedBoardId,
  selectBoardFilters,
  selectSelectedProjectId,
  selectBoardViewType,
} from "@app/slices/project/projectSlice";
import { BoardType, TaskType } from "@app/types/Project";

export const useBoardData = (projectId: number) => {
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const boardFilters = useSelector(selectBoardFilters);
  const { columns } = useColumns(Number(selectedBoardId));
  const selectedProjectId = useSelector(selectSelectedProjectId);

  const { data: { Data: tasks } = {}, isLoading: isTasksLoading } =
    useListProjectTasksQuery(Number(selectedProjectId), {
      skip: !selectedProjectId,
    });
  const boards = useBoards();
  const currentBoard = boards.find(
    (r) => r.Id === selectedBoardId
  ) as BoardType;

  const { data: customFields } = useListCustomFieldsQuery(projectId, {
    skip: !projectId,
  });
  const customFieldsVisibleOnCard = (customFields?.Data || []).filter(
    (r) => r.ShowInTaskCard && r.Enabled
  );

  const { goToTask, goToBoard } = useAppNavigate();

  const boardViewType = useSelector(selectBoardViewType);

  const tasksInBoard = (tasks || []).filter(
    (r) => r.BoardId === selectedBoardId
  );

  const subtasks = React.useMemo(
    () => tasksInBoard.filter((r) => r.ParentTaskItemId),
    [tasksInBoard]
  );

  const nonSubtasks = React.useMemo(
    () => tasksInBoard.filter((r) => !r.ParentTaskItemId),
    [tasksInBoard]
  );

  const findColumn = React.useCallback(
    (id: number) => columns.find((r) => r.Id === id),
    [columns]
  );

  const findTask = React.useCallback(
    (id: number) => {
      return tasks?.find((r) => r.Id === id) as TaskType;
    },
    [tasks]
  );

  const findSubtasks = React.useCallback(
    (id: number) => {
      return subtasks.filter((r) => r.ParentTaskItemId === id);
    },
    [subtasks]
  );

  const onTaskSelect = React.useCallback(
    (task: TaskType) => {
      if (task) {
        goToTask(task);
      }
    },
    [goToTask]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onTaskDelete = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_task: TaskType) => {
      goToBoard(currentBoard);
    },
    [goToBoard, currentBoard]
  );

  return {
    onTaskSelect,
    onTaskDelete,
    findTask,
    findSubtasks,
    findColumn,
    columns,
    boardViewType,
    subtasks,
    nonSubtasks,
    tasksInBoard,
    isTasksLoading,
    boardFilters,
    customFields,
    customFieldsVisibleOnCard,
  };
};
