import React from "react";
import { GroupMap } from "@ozgurrgul/dragulax";
import {
  BoardGroupableKey,
  CustomFieldBoardGroupableKey,
  TaskType,
} from "@app/types/Project";
import { useBoardData } from "../../hooks/useBoardData";
import { applyBoardFilters } from "../shared/boardFilterUtils";
import { TaskCustomFields } from "@app/types/CustomField";
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
): GroupMap => {
  const groupMap: GroupMap = {};
  distinctGroupValues.map((groupId) => {
    groupMap[groupId] = {
      cards: [],
    };
  });
  tasks.forEach((task) => {
    const groupValue = getGroupValue(task, groupableKey);

    if (!groupMap[groupValue]) {
      groupMap[groupValue] = {
        cards: [],
      };
    }

    groupMap[groupValue].cards.push({
      id: task.Id,
      data: task,
    });
  });
  return groupMap;
};

const groupTasksByCustomField = (
  distinctGroupValues: number[],
  tasks: TaskType[],
  taskCustomFieldValuesMap: TaskCustomFields,
  groupByCustomFieldId: CustomFieldBoardGroupableKey
): GroupMap => {
  const groupMap: GroupMap = {};
  distinctGroupValues.map((groupId) => {
    groupMap[groupId] = {
      cards: [],
    };
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

    if (!groupMap[customFieldValue]) {
      groupMap[customFieldValue] = {
        cards: [],
      };
    }

    groupMap[customFieldValue].cards.push({
      id: task.Id,
      data: task,
    });
  });

  return groupMap;
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
    groupBy,
  } = useBoardData(projectId);

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
    groupBy,
  };
};
