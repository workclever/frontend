import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedBoardId,
  selectSelectedTaskId,
  selectBoardFilters,
  selectBoardViewType,
  setSelectedTaskId as setSelectedTaskIdAction,
} from "../slices/project/projectSlice";
import { BoardType, ColumnType, TaskType } from "../types/Project";
import { useAppNavigate } from "./useAppNavigate";
import { useBoards } from "./useBoards";
import { useColumns } from "./useColumns";
import { useProjectTasks } from "./useProjectTasks";

export const useBoardData = () => {
  const dispatch = useDispatch();
  const selectedBoardId = useSelector(selectSelectedBoardId);
  const selectedTaskId = useSelector(selectSelectedTaskId);
  const boardFilters = useSelector(selectBoardFilters);
  const { columns } = useColumns(Number(selectedBoardId));
  const tasks = useProjectTasks();
  const boards = useBoards();
  const currentBoard = boards.find(
    (r) => r.Id === selectedBoardId
  ) as BoardType;

  const { goToTask, goToBoard } = useAppNavigate();

  const setSelectedTaskId = (taskId?: number) => {
    dispatch(setSelectedTaskIdAction(taskId));
  };

  const boardViewType = useSelector(selectBoardViewType);

  const verticality: { [key: string]: boolean } = {
    list: true,
    kanban: false,
  };
  const vertical = verticality[boardViewType];

  const subtasks = React.useMemo(
    () => Object.values(tasks).filter((r) => r.ParentTaskItemId),
    [tasks]
  );

  const nonSubtasks = React.useMemo(
    () => Object.values(tasks).filter((r) => !r.ParentTaskItemId),
    [tasks]
  );

  const dndItems = React.useMemo(() => {
    const sortedColumnData = columns.slice().sort((a, b) => a.Order - b.Order);

    const items: { [key: string]: string[] } = {};

    // initialize column parent
    sortedColumnData.forEach((column) => {
      items["column:" + column.Id] = [];
    });

    let nonSubtasksFiltered = nonSubtasks;
    if (boardFilters.searchText) {
      const trimedFilter = boardFilters.searchText.trim();
      nonSubtasksFiltered = nonSubtasksFiltered.filter(
        (r) =>
          r.Title.toLowerCase().indexOf(trimedFilter.toLowerCase()) > -1 ||
          r.Slug.toLowerCase().indexOf(trimedFilter.toLowerCase()) > -1
      );
    }
    const filteredUserIds = boardFilters.userIds || [];
    if (filteredUserIds.length > 0) {
      nonSubtasksFiltered = nonSubtasksFiltered.filter(
        (r) => filteredUserIds.indexOf(r.AssigneeUserId) > -1
      );
    }

    nonSubtasksFiltered.forEach((task) => {
      const columnTasks = nonSubtasksFiltered
        .filter((r) => r.ColumnId === task.ColumnId)
        .slice()
        .sort((a, b) => a.Order - b.Order)
        .map((task) => task.ColumnId + "-" + task.Id);
      if (columns.map((r) => r.Id).indexOf(task.ColumnId) > -1) {
        items["column:" + task.ColumnId] = columnTasks;
      }
    });

    return items;
  }, [columns, nonSubtasks, boardFilters]);

  const findColumn = React.useCallback(
    (id: ColumnType) => columns.find((r) => r.Id === Number(id)),
    [columns]
  );

  const findTask = React.useCallback(
    (id: number) => {
      return tasks[id] as TaskType;
    },
    [tasks]
  );

  const findSubtasks = React.useCallback(
    (id: number) => {
      return subtasks.filter((r) => r.ParentTaskItemId === id);
    },
    [subtasks]
  );

  const onTaskSelect = React.useCallback((task: TaskType) => {
    if (task) {
      goToTask(task);
      setSelectedTaskId(task.Id);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onTaskDelete = React.useCallback((_task: TaskType) => {
    setSelectedTaskId(undefined);
    goToBoard(currentBoard);
  }, []);

  return {
    dndItems,
    onTaskSelect,
    onTaskDelete,
    findTask,
    findSubtasks,
    findColumn,
    vertical,
    selectedTaskId,
    setSelectedTaskId,
    boardViewType,
  };
};
