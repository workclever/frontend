import { useBoardData } from "./useBoardData";
import React from "react";
import { ColumnMap } from "../dnd/kanban/types";

export const useKanbanBoardData = (projectId: number) => {
  const {
    columns,
    boardFilters,
    nonSubtasks,
    findSubtasks,
    onTaskSelect,
    findTask,
    customFieldsVisibleOnCard,
  } = useBoardData(projectId);

  const dndData = React.useMemo(() => {
    const items: ColumnMap = {};
    const orderedColumnIds = columns
      .slice()
      .sort((a, b) => a.Order - b.Order)
      .map((r) => r.Id);

    let nonSubtasksFiltered = nonSubtasks;
    if (boardFilters.filterText) {
      const trimedFilter = boardFilters.filterText.trim();
      nonSubtasksFiltered = nonSubtasksFiltered.filter(
        (r) =>
          r.Title.toLowerCase().indexOf(trimedFilter.toLowerCase()) > -1 ||
          r.Slug.toLowerCase().indexOf(trimedFilter.toLowerCase()) > -1
      );
    }
    const filteredUserIds = boardFilters.userIds || [];
    if (filteredUserIds.length > 0) {
      nonSubtasksFiltered = nonSubtasksFiltered.filter(
        (r) =>
          filteredUserIds.filter((f) => r.AssigneeUserIds.includes(f)).length ||
          nonSubtasks.find((r) =>
            boardFilters.userIds?.includes(r.ReporterUserId)
          )
      );
    }

    const columnTasks = nonSubtasksFiltered
      .slice()
      .sort((a, b) => a.Order - b.Order);

    nonSubtasksFiltered.forEach((task) => {
      if (columns.map((r) => r.Id).indexOf(task.ColumnId) > -1) {
        for (const col of columns) {
          items[col.Id] = {
            ...col,
            items: columnTasks
              .filter((r) => r.ColumnId === col.Id)
              .map((r) => r.Id),
          };
        }
      }
    });

    return { dndColumnMap: items, orderedColumnIds };
  }, [columns, nonSubtasks, boardFilters]);

  return {
    dndData,
    findSubtasks,
    onTaskSelect,
    findTask,
    customFieldsVisibleOnCard,
  };
};
