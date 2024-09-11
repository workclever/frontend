import { useEffect, useMemo } from "react";
import { ItemId, TreeItem } from "@ozgurrgul/dragulax";
import { TaskType } from "@app/types/Project";
import { useBoardData } from "../../hooks/useBoardData";
import {
  expandedTreeItemBulk,
  selectTreeExpandedKeys,
} from "@app/slices/board/boardSlice";
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
    findTask,
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
      tasksInBoardFiltered = tasksInBoardFiltered.filter(
        (r) =>
          filteredUserIds.filter((f) => r.AssigneeUserIds.includes(f)).length ||
          tasksInBoard.find((r) =>
            boardFilters.userIds?.includes(r.ReporterUserId)
          )
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
        id: `item-${task.Id}`,
        children: buildTaskTree(task.Id),
        isOpen: expandedKeys[`item-${task.Id}`] || false,
      }));
    };

    return columns.map((column) => ({
      id: `group-${column.Id}`,
      children: buildTaskTree(0).filter(
        (task) =>
          (findTask(Number(task.id.split("-")[1])) as TaskType).ColumnId ===
          column.Id
      ),
      isOpen: expandedKeys[`group-${column.Id}`] || false,
    }));
  }, [
    columns,
    tasksInBoard,
    nonSubtasks,
    boardFilters,
    expandedKeys,
    findTask,
  ]);

  useEffect(() => {
    dispatch(
      expandedTreeItemBulk(
        columns.map((column) => `group-${column.Id}` as ItemId)
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
    findTask,
  };
};
