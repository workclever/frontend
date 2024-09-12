import React from "react";
import { ColumnMap } from "@ozgurrgul/dragulax";
import {
  BoardGroupableKey,
  CustomFieldBoardGroupableKey,
  TaskType,
} from "@app/types/Project";
import { useBoardData } from "../../hooks/useBoardData";
import { applyBoardFilters } from "../shared/boardFilterUtils";
import { TaskCustomFields } from "@app/types/CustomField";
import { useSelector } from "react-redux";
import { selectBoardViewGroupKey } from "@app/slices/board/boardSlice";
import {
  getAllDistinctGroupValuesPerGroupableKey,
  getGroupValue,
} from "../shared/groupingUtils";
import { sortBy } from "lodash";
import { CUSTOM_FIELD_PREFIX, FIELD_UNASSIGNED } from "../shared/constants";

const groupTasks = (
  distinctGroupValues: number[],
  tasks: TaskType[],
  groupableKey: BoardGroupableKey
): { dndColumnMap: ColumnMap; orderedColumnIds: number[] } => {
  const dndColumnMap: ColumnMap = {};
  distinctGroupValues.map((groupId) => {
    dndColumnMap[groupId] = [];
  });
  tasks.forEach((task) => {
    const groupValue = getGroupValue(task, groupableKey);

    if (!dndColumnMap[groupValue]) {
      dndColumnMap[groupValue] = [];
    }

    dndColumnMap[groupValue].push(task.Id);
  });
  return {
    dndColumnMap,
    orderedColumnIds: distinctGroupValues,
  };
};

const groupTasksByCustomField = (
  distinctGroupValues: number[],
  tasks: TaskType[],
  taskCustomFieldValuesMap: TaskCustomFields,
  groupByCustomFieldId: CustomFieldBoardGroupableKey
): { dndColumnMap: ColumnMap; orderedColumnIds: number[] } => {
  const dndColumnMap: ColumnMap = {};
  distinctGroupValues.map((groupId) => {
    dndColumnMap[groupId] = [];
  });
  const customFieldId = Number(
    groupByCustomFieldId.split(CUSTOM_FIELD_PREFIX)[1]
  );

  tasks.forEach((task) => {
    let customFieldValue =
      // TODO dont cast number
      Number(taskCustomFieldValuesMap[task.Id]?.[customFieldId]) || null;

    if (!customFieldValue) {
      customFieldValue = FIELD_UNASSIGNED;
    }

    if (!dndColumnMap[customFieldValue]) {
      dndColumnMap[customFieldValue] = [];
    }

    dndColumnMap[customFieldValue].push(task.Id);
  });

  return {
    dndColumnMap,
    orderedColumnIds: distinctGroupValues,
  };
};

export const useKanbanBoardData = (projectId: number) => {
  const {
    columns,
    boardFilters,
    nonSubtasks,
    findSubtasks,
    onTaskSelect,
    findTask,
    taskCustomFieldValuesMap,
    customFieldsVisibleOnCard,
  } = useBoardData(projectId);

  const groupBy = useSelector(selectBoardViewGroupKey);

  const dndData = React.useMemo(() => {
    const distinctGroupValuesPerGroupableKey =
      getAllDistinctGroupValuesPerGroupableKey({
        columns,
        tasks: nonSubtasks,
        taskCustomFieldValuesMap,
      });
    const filteredTasks = applyBoardFilters(nonSubtasks, boardFilters);
    const sortedTasks = sortBy(filteredTasks, "Order");
    const distinctGroupValues =
      distinctGroupValuesPerGroupableKey[groupBy] || [];

    return groupBy.startsWith(CUSTOM_FIELD_PREFIX)
      ? groupTasksByCustomField(
          distinctGroupValues,
          sortedTasks,
          taskCustomFieldValuesMap,
          groupBy as CustomFieldBoardGroupableKey
        )
      : groupTasks(distinctGroupValues, sortedTasks, groupBy);
  }, [columns, nonSubtasks, taskCustomFieldValuesMap, boardFilters, groupBy]);

  return {
    dndData,
    findSubtasks,
    onTaskSelect,
    findTask,
    customFieldsVisibleOnCard,
  };
};
