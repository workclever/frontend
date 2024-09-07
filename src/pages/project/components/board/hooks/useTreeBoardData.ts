import { useEffect, useMemo } from "react";
import { ItemId, TreeItem } from "../dnd/tree/types";
import { TaskType } from "@app/types/Project";
import { useBoardData } from "./useBoardData";
import {
  expandedTreeItemBulk,
  selectTreeExpandedKeys,
} from "@app/slices/project/projectSlice";
import { useDispatch, useSelector } from "react-redux";

export const useTreeBoardData = (projectId: number) => {
  const dispatch = useDispatch();
  const {
    columns,
    tasksInBoard,
    customFields,
    customFieldsVisibleOnCard,
    boardFilters,
    nonSubtasks,
    isTasksLoading,
    findSubtasks,
    onTaskSelect,
  } = useBoardData(projectId);

  const expandedKeys = useSelector(selectTreeExpandedKeys);

  const dndData: TreeItem[] = useMemo(() => {
    let tasksInBoardFiltered = tasksInBoard;
    if (boardFilters.filterText || boardFilters.userIds?.length) {
      // Take only non subTasks
      tasksInBoardFiltered = nonSubtasks;
    }
    if (boardFilters.filterText) {
      const trimedFilter = boardFilters.filterText.trim();
      tasksInBoardFiltered = tasksInBoardFiltered.filter(
        (r) =>
          r.Title.toLowerCase().indexOf(trimedFilter.toLowerCase()) > -1 ||
          r.Slug.toLowerCase().indexOf(trimedFilter.toLowerCase()) > -1
      );
    }

    const filteredUserIds = boardFilters.userIds || [];
    if (filteredUserIds.length > 0) {
      tasksInBoardFiltered = tasksInBoardFiltered.filter((r) =>
        filteredUserIds.filter((f) => r.AssigneeUserIds.includes(f))
      );
    }

    const tasksByParent: { [key: number]: TaskType[] } = {};
    tasksInBoardFiltered.forEach((task) => {
      const parentId = task.ParentTaskItemId ?? 0;
      if (!tasksByParent[parentId]) {
        tasksByParent[parentId] = [];
      }
      tasksByParent[parentId].push(task);
    });

    Object.keys(tasksByParent).forEach((parentId) => {
      tasksByParent[Number(parentId)].sort((a, b) => a.Order - b.Order);
    });

    const buildTaskTree = (parentId: number): TreeItem[] => {
      const children = tasksByParent[parentId] || [];
      return children.map((task) => ({
        id: `task-${task.Id}`,
        children: buildTaskTree(task.Id),
        isOpen: expandedKeys[`task-${task.Id}`] || false,
        data: task,
      }));
    };

    return columns.map((column) => ({
      id: `column-${column.Id}`,
      children: buildTaskTree(0).filter(
        (task) => (task.data as TaskType).ColumnId === column.Id
      ),
      isOpen: expandedKeys[`column-${column.Id}`] || false,
      data: column,
    }));
  }, [columns, tasksInBoard, nonSubtasks, boardFilters, expandedKeys]);

  useEffect(() => {
    dispatch(
      expandedTreeItemBulk(
        columns.map((column) => `column-${column.Id}` as ItemId)
      )
    );
  }, [dispatch, columns]);

  return {
    dndData,
    tasksInBoard,
    customFields,
    customFieldsVisibleOnCard,
    isTasksLoading,
    findSubtasks,
    onTaskSelect,
  };
};
