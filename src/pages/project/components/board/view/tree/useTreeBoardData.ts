import React from "react";
import { ItemId, TreeItem } from "@ozgurrgul/dragulax";
import {
  TaskType,
  BoardGroupableKey,
  CustomFieldBoardGroupableKey,
} from "@app/types/Project";
import { useBoardData } from "../../hooks/useBoardData";
import {
  expandedTreeItemBulk,
  selectTreeExpandedKeys,
} from "@app/slices/board/boardSlice";
import { useDispatch, useSelector } from "react-redux";
import { applyBoardFilters } from "../shared/boardFilterUtils";
import { TaskCustomFields } from "@app/types/CustomField";
import {
  getAllDistinctGroupValuesPerGroupableKey,
  getGroupValue,
} from "../shared/groupingUtils";
import { sortBy } from "../shared/sortUtils";
import { CUSTOM_FIELD_PREFIX, FIELD_UNASSIGNED } from "../shared/constants";

const groupTasks = (
  tasks: TaskType[],
  groupableKey: BoardGroupableKey
): { [key: number]: TaskType[] } => {
  const groupedTasks: { [key: number]: TaskType[] } = {};

  tasks.forEach((task) => {
    const groupValue = getGroupValue(task, groupableKey);

    if (!groupedTasks[groupValue]) {
      groupedTasks[groupValue] = [];
    }

    groupedTasks[groupValue].push(task);
  });

  return groupedTasks;
};

const groupTasksByCustomField = (
  tasks: TaskType[],
  taskCustomFieldValuesMap: TaskCustomFields,
  groupByCustomFieldId: CustomFieldBoardGroupableKey
): { [key: number]: TaskType[] } => {
  const groupedTasks: { [key: number]: TaskType[] } = {};
  const customFieldId = Number(
    groupByCustomFieldId.split(CUSTOM_FIELD_PREFIX)[1]
  );

  tasks.forEach((task) => {
    let customFieldValue =
      Number(taskCustomFieldValuesMap[task.Id]?.[customFieldId]) || null;

    if (!customFieldValue) {
      customFieldValue = FIELD_UNASSIGNED;
    }

    if (!groupedTasks[customFieldValue]) {
      groupedTasks[customFieldValue] = [];
    }

    groupedTasks[customFieldValue].push(task);
  });

  return groupedTasks;
};
export const useTreeBoardData = (projectId: number) => {
  const dispatch = useDispatch();
  const {
    columns,
    boardFilters,
    nonSubtasks,
    isTasksLoading,
    findSubtasks,
    onTaskSelect,
    findTask,
    tasksInBoard,
    customFields,
    taskCustomFieldValuesMap,
    customFieldsVisibleOnCard,
    groupBy,
  } = useBoardData(projectId);

  const expandedKeys = useSelector(selectTreeExpandedKeys);

  const dndData: TreeItem[] = React.useMemo(() => {
    const filteredTasks = applyBoardFilters(nonSubtasks, boardFilters);
    const sortedTasks = sortBy(filteredTasks, "Order");
    const groupedTasks = groupBy.startsWith(CUSTOM_FIELD_PREFIX)
      ? groupTasksByCustomField(
          sortedTasks,
          taskCustomFieldValuesMap,
          groupBy as CustomFieldBoardGroupableKey
        )
      : groupTasks(sortedTasks, groupBy);

    const distinctGroupValuesPerGroupableKey =
      getAllDistinctGroupValuesPerGroupableKey({
        columns,
        tasks: nonSubtasks,
        taskCustomFieldValuesMap,
      });

    const buildTaskTree = (tasks: TaskType[]): TreeItem[] => {
      const tasksByParent: { [key: number]: TaskType[] } = {};
      tasks.forEach((task) => {
        const parentId = task.ParentTaskItemId ?? 0;
        if (!tasksByParent[parentId]) {
          tasksByParent[parentId] = [];
        }
        tasksByParent[parentId].push(task);
      });

      const buildSubtree = (parentId: number): TreeItem[] => {
        const children = tasksByParent[parentId] || [];
        return children.map((task) => ({
          id: `item-${task.Id}`,
          children: buildSubtree(task.Id),
          isOpen: expandedKeys[`item-${task.Id}`] || false,
        }));
      };

      return buildSubtree(0);
    };

    const orderedGroupIds = distinctGroupValuesPerGroupableKey[groupBy] || [];

    return orderedGroupIds.map((groupId) => ({
      id: `group-${groupId}`,
      children: buildTaskTree(groupedTasks[groupId] || []),
      isOpen: expandedKeys[`group-${groupId}`] || false,
    }));
  }, [
    columns,
    nonSubtasks,
    boardFilters,
    expandedKeys,
    groupBy,
    taskCustomFieldValuesMap,
  ]);

  React.useEffect(() => {
    const distinctGroupValuesPerGroupableKey =
      getAllDistinctGroupValuesPerGroupableKey({
        columns,
        tasks: nonSubtasks,
        taskCustomFieldValuesMap,
      });
    const groupIds = distinctGroupValuesPerGroupableKey[groupBy] || [];
    dispatch(
      expandedTreeItemBulk(groupIds.map((id) => `group-${id}` as ItemId))
    );
  }, [dispatch, columns, nonSubtasks, groupBy, taskCustomFieldValuesMap]);

  return {
    dndData,
    tasksInBoard,
    customFields,
    customFieldsVisibleOnCard,
    isTasksLoading,
    findSubtasks,
    onTaskSelect,
    findTask,
    groupBy,
  };
};
