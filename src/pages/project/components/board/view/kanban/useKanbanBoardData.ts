import React from "react";
import { GroupArray } from "@ozgurrgul/dragulax";
import {
  BoardGroupableKey,
  CustomFieldBoardGroupableKey,
  TaskType,
} from "@app/types/Project";
import { useBoardData } from "../../hooks/useBoardData";
import { applyBoardFilters } from "../shared/boardFilterUtils";
import { CustomFieldValue, TaskCustomFields } from "@app/types/CustomField";
import {
  getAllDistinctGroupValuesPerGroupableKey,
  getGroupValue,
} from "../shared/groupingUtils";
import { sortBy } from "lodash";
import { CUSTOM_FIELD_PREFIX, FIELD_UNASSIGNED } from "../shared/constants";

const groupTasks = (
  distinctGroupValues: CustomFieldValue[],
  tasks: TaskType[],
  groupableKey: BoardGroupableKey
): GroupArray => {
  const groupMap: GroupArray = [];
  distinctGroupValues.map((customFieldValue) => {
    groupMap.push({
      groupId: String(customFieldValue),
      cards: [],
      data: { groupValues: customFieldValue },
    });
  });
  tasks.forEach((task) => {
    const groupValue = getGroupValue(task, groupableKey);
    const localMap = groupMap.find((r) => r.groupId === String(groupValue));
    if (!localMap) {
      return;
    }
    localMap.cards.push({
      id: task.Id,
      data: task,
    });
  });
  return groupMap;
};

const groupTasksByCustomField = (
  distinctGroupValues: CustomFieldValue[],
  tasks: TaskType[],
  taskCustomFieldValuesMap: TaskCustomFields,
  groupByCustomFieldId: CustomFieldBoardGroupableKey
): GroupArray => {
  const groupMap: GroupArray = [];
  distinctGroupValues.map((customFieldValue) => {
    groupMap.push({
      groupId: String(customFieldValue),
      cards: [],
      data: {
        customFieldId: groupByCustomFieldId,
        groupValues: customFieldValue,
      },
    });
  });
  const customFieldId = Number(
    groupByCustomFieldId.split(CUSTOM_FIELD_PREFIX)[1]
  );

  tasks.forEach((task) => {
    let customFieldValue = taskCustomFieldValuesMap[task.Id]?.[customFieldId];

    if (typeof customFieldValue !== "boolean" && !customFieldValue) {
      customFieldValue = FIELD_UNASSIGNED;
    }

    const localMap = groupMap.find(
      (r) => r.groupId === String(customFieldValue)
    );
    if (!localMap) {
      return;
    }
    localMap.cards.push({
      id: task.Id,
      data: task,
    });
  });

  return groupMap.sort((a, b) => a.groupId.localeCompare(b.groupId));
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
